import './index.css'
import React, { useState } from 'react'
import { EPlotTypes, AxiomSensorPlot } from '@axdspub/axiom-charts'
// import wfs_shellbase_data from './wfs_shellbase.json'
import { createRoot } from 'react-dom/client'

// const defaultChartArgs = {
//   settings: {
//     width: 500,
//     height: 200,
//     margin: {
//       top: 10,
//       right: 10,
//       left: 40,
//       bottom: 30,
//     },
//   },
// }

// export const Scatter = {
//   args: {
//     chartArgs: {
//       label: 'Scatter plot',
//       ...defaultChartArgs,
//       plots: [
//         {
//           id: 'waterTemperatureTimeSeriesScatter',
//           dataService: {
//             type: 'preloaded',
//             url: 'preloaded',
//             result: {
//               data: wfs_shellbase_data,
//             },
//             parser: {
//               type: 'geojsonTimeSeries',
//               args: {
//                 valueProp: 'salinity(ppt)',
//                 timeProp: 'sample_datetime',
//               },
//             },
//           },
//           dimensions: {
//             x: {
//               property: 'time',
//               parameter: 'time',
//             },
//             y: {
//               property: 'salinity(ppt)',
//               parameter: 'salinity',
//               label: 'Salinity (ppt)',
//             },
//           },
//           style: {
//             strokeColor: 'red',
//             strokeWidth: 2,
//             radius: 1,
//             fill: '#FFF',
//           },
//           type: EPlotTypes.line,
//         },
//       ],
//     },
//   },
// }

interface IAppProps {
  email: string
  params: {
    plot_type: string
    station_id: string
    sensor_id: string
  }
}

const App = ({ props }: { props: IAppProps }) => {
  console.log(props)
  const { station_id, sensor_id } = props.params
  return (
    <div className='container'>
      <div className='text-slate-800 font-semibold uppercase text-center'>
        Station {station_id}
      </div>
      {/* <Chart {...Scatter.args.chartArgs}></Chart> */}
      <AxiomSensorPlot
        stationId={parseInt(station_id)}
        parameterGroupId={parseInt(sensor_id)}
        timeBin='monthly'
      />
    </div>
  )
}

/**
 * Let TypeScript know that we have a global variable that is set by the plugin php.
 */
declare global {
  interface Window {
    axds_wp_plugins_params: IAppProps
    parameters: any
    widgets: any
  }
}

/**
 * This is a default set of props that will be used in development mode.
 * Parameters are set via shortcode, but that doesn't exist in development mode.
 */
const PROPS_FOR_DEVELOPMENT_MODE: IAppProps = {
  email: 'steven@axds.co',
  params: {
    plot_type: 'scatter',
    station_id: '13838',
    sensor_id: '6',
  },
}

const rootElement = document.getElementById('axds-wp-plugins-root')
if (rootElement !== null) {
  console.log('parameters', window['parameters'])
  if (window.axds_wp_plugins_params === undefined) {
    window.axds_wp_plugins_params = PROPS_FOR_DEVELOPMENT_MODE
  }
  createRoot(rootElement).render(
    <React.StrictMode>
      <App props={window.axds_wp_plugins_params as IAppProps} />
    </React.StrictMode>,
  )
}
