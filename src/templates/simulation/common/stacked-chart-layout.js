// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { stackedChart } from '../../../browser/charts/stacked'
// Components
import Helmet from 'react-helmet'
import CircularProgress from '@material-ui/core/CircularProgress'
import CopyBox from '../../../components/copy-box'
import Related from './related'
import Metas from './metas'

class StackedChartLayout extends React.Component {
  constructor (props) {
    super(props)

    const { data, pageContext } = this.props
    const { reportsPath } = data.site.siteMetadata
    const { name } = pageContext
    this.state = {
      filePath: `${reportsPath}${name}.json`
    }
  }

  componentDidMount () {
    const { chartTitle, i18nPlugin, pageContext } = this.props
    const { filePath } = this.state
    const { lang } = i18nPlugin
    const { simulationType, templateDPS } = pageContext
    stackedChart(simulationType, filePath, chartTitle, templateDPS, lang)
      .catch((err) => { console.error(err) })
  }

  render () {
    const { children, data, i18nPlugin, pageContext } = this.props
    const { filePath } = this.state
    const { t } = i18nPlugin
    const { azeritePowerWeights, simcBuildTimestamp, fightStyle, fightLength, fightLengthVariation, name, simcGitRevision, simulationFeaturedOrder, simulationCategory, simulationType, spec, targetError, templateTalents, templateDPS, tier, variation, wowBuild, wowClass, wowVersion } = pageContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={filePath}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        {children}
        <Related data={data} fightStyle={fightStyle} simulationFeaturedOrder={simulationFeaturedOrder}
          simulationCategory={simulationCategory} simulationType={simulationType} spec={spec} t={t} tier={tier}
          variation={variation}/>
        <Metas i18nPlugin={i18nPlugin} fightLength={fightLength} fightLengthVariation={fightLengthVariation}
          simcBuildTimestamp={simcBuildTimestamp} simcGitRevision={simcGitRevision}
          targetError={targetError} templateTalents={templateTalents} templateDPS={templateDPS}
          wowBuild={wowBuild} wowVersion={wowVersion}/>
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
