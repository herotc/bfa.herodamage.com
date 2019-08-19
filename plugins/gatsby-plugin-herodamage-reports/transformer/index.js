import { createHash } from 'crypto'
import { readFile } from 'fs'
import { resolve } from 'path'
import { promisify } from 'util'
import {
  getAzeriteInformationById,
  getAzeriteInformationByName,
  getWowClassIdAndSpecId
} from '../../../src/utils/wow/core'
import * as mapping from './mapping'

// Until we get promisified version from fs (promises API is still experimental)
const readFilePromise = promisify(readFile)

export class ReportTransformer {
  constructor (node, actions) {
    this.node = node
    this.actions = actions
    this.reportFields = {} // Hold all the fields that will be registered
    this.extraFields = {} // Hold all the fields that will not be registered but can be used by the transformer

    const { name } = this.node
    const [simulationName, fightStyle, tier, wowClass, spec, variation] = name.toLowerCase().split('_')
    Object.assign(this.extraFields, { simulationName })

    const { simulationFeaturedOrder, simulationCategory, simulationType, simulationTypeOrder, simulationTemplate } = mapping.simulationDetails[simulationName]
    let slug = `/${wowClass}/${simulationType}/${fightStyle}-${tier}-${spec}`
    if (variation) slug += `-${variation}`
    Object.assign(this.reportFields, {
      slug, // '/death-knight/trinkets/1t-t21-frost-cold-heart-runic-attenuation'
      name, // 'TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation'
      wowClass, // 'death-knight'
      simulationFeaturedOrder: simulationFeaturedOrder, // 3
      simulationCategory, // 'trinkets'
      simulationType, // 'trinkets'
      simulationTypeOrder, // null
      simulationTemplate, // 'trinkets'
      tier, // 't21'
      spec, // 'frost'
      variation: variation || '', // 'cold-heart-runic-attenuation'
      fightStyle // '1t'
    })
  }

  /*
  |=====================================================================================================================
  | generateReportNode
  |=====================================================================================================================
  */

  /**
   *
   * @returns {Promise<void>}
   */
  async extractDataFromFile () {
    const { absolutePath, name } = this.node
    const { simulationType } = this.reportFields

    // Fetch the report file
    let report
    try {
      const jsonFile = await readFilePromise(absolutePath, { encoding: 'utf8', flag: 'r' })
      report = JSON.parse(jsonFile)
    } catch (err) {
      console.error(`Error while processing the '${name}' report:`, err)
      return
    }
    const { metas, results } = report
    Object.assign(this.extraFields, { results })

    let processedResults
    switch (simulationType) {
      case 'combinations-default':
        let label = ''
        const powerLabels = []
        for (const simcEncoded of metas.templateGear) {
          const parts = simcEncoded.split(',')
          for (const part of parts) {
            const [option, value] = part.split('=')
            switch (option) {
              case 'azerite_powers':
                const powersId = value.split('/')
                for (const powerId of powersId) {
                  if (powerId === '' || parseInt(powerId) <= 12) continue
                  const azeriteInformation = getAzeriteInformationById(powerId)
                  if (!azeriteInformation) {
                    console.log(`Cannot find information about azerite powerId "${powerId}" in "${name}"`)
                    continue
                  }
                  const { spellName, tier } = azeriteInformation
                  if (tier === 3) powerLabels.push(spellName)
                }
                break
            }
          }
        }
        label += powerLabels.join(' / ')
        processedResults = results.map((result) => {
          result[3] = label
          return result
        })
        break
      default:
        processedResults = results
        break
    }

    Object.assign(this.reportFields, {
      resultsRaw: JSON.stringify(processedResults),
      fightLength: metas.fightLength,
      fightLengthVariation: metas.fightLengthVariation,
      targetError: metas.targetError,
      templateGear: metas.templateGear,
      templateTalents: metas.templateTalents,
      templateDPS: metas.templateDPS,
      elapsedTime: metas.elapsedTime,
      totalEventsProcessed: metas.totalEventsProcessed,
      totalIterations: metas.totalIterations,
      totalActors: metas.totalActors,
      simcBuildTimestamp: metas.simcBuildTimestamp,
      simcGitRevision: metas.simcGitRevision || '',
      wowVersion: metas.wowVersion,
      wowBuild: metas.wowBuild
    })
  }

  generateAdditionalReportFields () {
    const { fightStyle, simulationType, spec, tier, wowClass } = this.reportFields
    const { results } = this.extraFields

    // Generate AzeriteForge & AzeritePowerWeights Import String
    switch (simulationType) {
      case 'azerite-levels':
      case 'azerite-stacks':
        // Build the powers arrays
        const afPowers = [] // AzeriteForge (AF)
        const apwPowers = [] // AzeritePowerWeights (APW)
        for (let i = 1; i < results.length; i++) {
          const value = results[i]
          const parts = value.shift().split('--') // Split up the variations, those aren't supported by the addons atm
          const spellNames = parts[0].split(' / ') // Some labels are concatened, like the Alliance / Horde one, we always take the first one
          if (!parts[1]) {
            // Insert each power (powerId and meanDPS)
            for (const spellName of spellNames) {
              const azeriteInformation = getAzeriteInformationByName(spellName)
              if (!azeriteInformation) continue
              const { powerId } = azeriteInformation

              // Use actual values for AzeriteForge
              const afWeights = []
              for (let j = 1; j < results[0].length; j++) {
                afWeights.push(`${results[0][j]}:${value[j - 1]}`)
              }
              const afString = `[${powerId}]${afWeights.join(',')},^`
              let existingIdx = afPowers.findIndex(item => item.includes(`[${powerId}]`))
              if (existingIdx < 0) {
                afPowers.push(afString)
              } else if (parts[1] && parts[1].includes('talents:')) {
                afPowers[existingIdx] = afString
              }

              // Calculate mean DPS for AzeritePowerWeights
              const totalDPS = value.reduce((accumulator, currentValue) => accumulator + currentValue)
              const meanDPS = totalDPS / value.length
              existingIdx = apwPowers.findIndex(item => item.powerId === powerId)
              if (existingIdx < 0) {
                apwPowers.push({ powerId, meanDPS })
              } else if (parts[1] && parts[1].includes('talents:')) {
                apwPowers[existingIdx].meanDPS = meanDPS
              }
            }
          }
        }

        const { classId, specId } = getWowClassIdAndSpecId(wowClass, spec)

        // Create the import string for AzeriteForge
        const afWeightsString = `AZFORGE:${classId}:${specId}^${afPowers.join('')}`

        // Create the import string for AzeritePowerWeights
        apwPowers.sort((a, b) => b.meanDPS - a.meanDPS) // Descending sort using meanDPS
        // Compute the weights
        const bestPower = apwPowers[0]
        bestPower.weight = 10 // Defined by the addon as reference
        for (let i = 1; i < apwPowers.length; i++) {
          // Compute the weight relatively to the best power
          const power = apwPowers[i]
          power.weight = (power.meanDPS / bestPower.meanDPS * bestPower.weight).toFixed(2)
        }
        const apwWeights = apwPowers.map(({ powerId, weight }) => `${powerId}=${weight}`)
        const apwWeightsName = `herodamage.com - ${simulationType === 'azeritelevels' ? 'Levels' : 'Stacks'}_${fightStyle.toUpperCase()}_${tier.toUpperCase()}`
        const apwWeightsString = `( AzeritePowerWeights:2:"${apwWeightsName}":${classId}:${specId}: ${apwWeights.join(', ')}: )`

        // Save them
        Object.assign(this.reportFields, {
          azeriteForgeWeights: afWeightsString,
          azeritePowerWeights: apwWeightsString
        })
        break
    }
  }

  registerPagesDetails () {
    const { wowClasses, simulationsName, fightStyles, tiers, reportFieldsName } = ReportTransformer.pagesDetails
    const { wowClass, fightStyle, tier } = this.reportFields
    const { simulationName } = this.extraFields

    // Used to create WoW classes & Performance pages
    if (!wowClasses.includes(wowClass)) wowClasses.push(wowClass)
    if (!simulationsName.includes(simulationName)) simulationsName.push(simulationName)
    if (!fightStyles.includes(fightStyle)) fightStyles.push(fightStyle)
    if (!tiers.includes(tier)) tiers.push(tier)

    // Used to automatically retrieve all reportFields registered through the transformer in the simulation query
    for (const nodeFieldName of Object.keys(this.reportFields)) {
      if (!reportFieldsName.includes(nodeFieldName)) reportFieldsName.push(nodeFieldName)
    }
  }

  createNodeFields () {
    const node = this.node
    const { createNode, createParentChildLink } = this.actions
    const fields = this.reportFields

    const nodeData = {
      id: `${node.id} >>> HeroDamageReport`,
      parent: node.id,
      children: [],
      internal: {
        type: 'HeroDamageReport',
        contentDigest: createHash('md5').update(JSON.stringify(fields)).digest('hex'),
        description: 'Node representing the data from the json reports processed by the reports plugin.'
      },
      reportFields: { ...fields }
    }
    createNode(nodeData)
    createParentChildLink({ parent: node, child: nodeData })
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async generateReportNode () {
    await this.extractDataFromFile()
    this.generateAdditionalReportFields()
    this.createNodeFields()
    this.registerPagesDetails()
  }

  /*
  |=====================================================================================================================
  | createPages
  |=====================================================================================================================
  */

  /**
   *
   * @param api
   * @returns {Promise<void>}
   */
  static async createPages (api) {
    const { graphql, actions: { createPage } } = api
    const { wowClasses, simulationsName, fightStyles, tiers, reportFieldsName } = ReportTransformer.pagesDetails

    // WoW classes
    for (const wowClass of wowClasses) {
      const slug = `/${wowClass}/`
      createPage({ path: slug, component: resolve('./src/templates/wow-class.js'), context: { slug, wowClass } })
    }

    // SimC Performance
    for (const simulationName of simulationsName) {
      for (const fightStyle of fightStyles) {
        for (const tier of tiers) {
          const { simulationFeaturedOrder, simulationCategory, simulationType, simulationTypeOrder } = mapping.simulationDetails[simulationName]
          const slug = `/simc-performance/${simulationType}/${fightStyle}-${tier}`
          createPage({
            path: slug,
            component: resolve('./src/templates/simc-performance.js'),
            context: {
              slug,
              simulationFeaturedOrder,
              simulationCategory,
              simulationType,
              simulationTypeOrder,
              fightStyle,
              tier
            }
          })
        }
      }
    }

    // Simulations
    const result = await graphql(`
      {
        allHeroDamageReport {
          edges {
            node {
              reportFields {
                ${reportFieldsName.join(' ')}
              }
            }
          }
        }
      }
    `)
    const { data: { allHeroDamageReport: { edges } } } = result
    edges.forEach(({ node: { reportFields } }) => {
      const { slug, simulationTemplate } = reportFields
      createPage({
        path: slug,
        component: resolve(`./src/templates/simulation/${simulationTemplate}.js`),
        context: reportFields
      })
    })
  }
}

/**
 * Hold all the details to create the pages
 * @type {{wowClasses: Array, simulationsName: Array, fightStyles: Array, tiers: Array, reportFieldsName: Array}}
 */
ReportTransformer.pagesDetails = {
  wowClasses: [],
  simulationsName: [],
  fightStyles: [],
  tiers: [],
  reportFieldsName: []
}
