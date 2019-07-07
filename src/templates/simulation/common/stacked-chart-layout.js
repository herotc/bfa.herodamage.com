// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { stackedChart } from '../../../browser/charts/stacked'
import toUpper from 'lodash/toUpper'
import startCase from 'lodash/startCase'
import { getSpecWithVariation } from '../../../utils/wow/ui'
// Components
import CircularProgress from '@material-ui/core/CircularProgress'
import CopyBox from '../../../components/copy-box'
import Related from './related'
import Metas from './metas'

class StackedChartLayout extends React.Component {
  componentDidMount () {
    const { chartTitle, i18nPlugin, pageContext } = this.props
    const { lang } = i18nPlugin
    stackedChart(pageContext, chartTitle, lang)
      .catch((err) => { console.error(err) })
  }

  render () {
    const { children, data, i18nPlugin, pageContext } = this.props
    const { t } = i18nPlugin
    const { azeriteForgeWeights, azeritePowerWeights, fightStyle, fightLength, fightLengthVariation, name, simcBuildTimestamp, simcGitRevision, simulationFeaturedOrder, simulationCategory, simulationType, spec, targetError, templateGear, templateTalents, templateDPS, tier, variation, wowBuild, wowClass, wowVersion } = pageContext
    return (
      <div>
        <h1>{startCase(simulationType)} {toUpper(fightStyle)} {toUpper(tier)} {getSpecWithVariation(t, spec, variation)} {startCase(t(wowClass))}</h1>
        {children}
        <Related data={data} fightStyle={fightStyle} simulationFeaturedOrder={simulationFeaturedOrder}
          simulationCategory={simulationCategory} simulationType={simulationType} spec={spec} t={t} tier={tier}
          variation={variation}/>
        <Metas i18nPlugin={i18nPlugin} fightLength={fightLength} fightLengthVariation={fightLengthVariation}
          simcBuildTimestamp={simcBuildTimestamp} simulationCategory={simulationCategory}
          simcGitRevision={simcGitRevision} targetError={targetError} templateGear={templateGear}
          templateTalents={templateTalents} templateDPS={templateDPS} wowBuild={wowBuild} wowClass={wowClass}
          wowVersion={wowVersion}/>
        {azeriteForgeWeights &&
        <CopyBox elementId="azerite-forge-weights" text={azeriteForgeWeights}
          title="AzeriteForge Import String"/>}
        {azeritePowerWeights &&
        <CopyBox elementId="azerite-power-weights" text={azeritePowerWeights}
          title="AzeritePowerWeights Import String"/>}
        {simulationType.includes('azerite') &&
        <p style={{ textAlign: 'center' }}>
          <span className={'azerite-tier3-specific'}>Outer Ring (Spec Specific)</span>
          &nbsp;|&nbsp;
          <span className={'azerite-tier3-generic'}>Outer Ring (Generic)</span>
          &nbsp;|&nbsp;
          <span className={'azerite-tier2'}>Inner Ring</span>
        </p>}
        {simulationType.includes('essences') &&
        <p style={{ textAlign: 'center' }}>
          <span className={'azerite-essence-major'}>Major + Minor</span>
          &nbsp;|&nbsp;
          <span className={'azerite-essence-minor'}>Minor</span>
        </p>}
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart-labels"/>
        <div id="google-chart"/>
      </div>
    )
  }
}

StackedChartLayout.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object,
  pageContext: PropTypes.object.isRequired
}

export default StackedChartLayout
