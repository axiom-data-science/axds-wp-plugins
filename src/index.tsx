import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  AxiomSensorPlot,
  AxiomVirtualSensorPlot,
  IChartSettingsProps,
  convertShortCodeInputToChartSettingsProps
} from '@axdspub/axiom-charts'
import * as _ from 'lodash'
import dot from 'dot-object'

const camelize = (obj: any) =>
  _.transform(obj, (acc: any, value, key: string, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key)

    acc[camelKey] = _.isObject(value) ? camelize(value) : value
  })

declare global {
  interface Window {
    renderGroups: any
    widgets: Record<string, IWidget>
  }
}

type Base = Record<string, string>
interface BaseExtended extends Base {
  id: string
}

type IWidgetParameters = Record<string, any>

interface IWidget {
  id: string
  type: string
  parameters: Record<string, string | IWidgetParameters>
}

interface ITestWidgetProps {
  id: string
  widget: IWidget
}
const TestWidget = ({ id, widget }: ITestWidgetProps) => {
  return (
    <div className='bg-slate-300 rounded-lg px-4 py-2'>
      Test Widget {id}
      <br />
      {widget.type}
      <br />
      {JSON.stringify(widget.parameters)}
    </div>
  )
}

interface ISensorWidgetParameters extends IWidgetParameters {
  station_id: string
  sensor_id: string
  height?: string
  time_bin?: string
  default_chart_settings?: Record<string, any>
}
interface ISensorWidget extends IWidget {
  parameters: ISensorWidgetParameters
}
interface ISensorWidgetProps {
  id: string
  widget: ISensorWidget
}


interface IVirtualSensorWidgetParameters extends IWidgetParameters {
  dataset: string
  variable: string
}
interface IVirtualSensorWidget extends IWidget {
  parameters: IVirtualSensorWidgetParameters
}
interface IVirtualSensorWidgetProps{
  id: string
  widget: IVirtualSensorWidget

}

const convertParametersToProps = (parameters: IWidgetParameters) => {
  const converted: any = camelize(parameters)
  const defaultChartSettings =
    converted.defaultChartSettings as IChartSettingsProps

  return {
    ...converted,
    defaultChartSettings: convertShortCodeInputToChartSettingsProps(defaultChartSettings)
  }
}

const SensorWidget = ({ id, widget }: ISensorWidgetProps) => {
  try {
    const props = convertParametersToProps(widget.parameters)
    if (props.stationId) {
      props.stationId = parseInt(props.stationId)
    } else {
      throw 'station_id is required'
    }
  
    if (props.sensorId) {
      props.parameterGroupId = parseInt(props.sensorId)
      delete props.sensorId
    } else {
      if (props.parameterGroupId) {
        props.parameterGroupId = parseInt(props.parameterGroupId)
      } else {
        throw 'sensor_id is required'
      }
    }
    return <AxiomSensorPlot {...props} />
  } catch (error) {
    return <div>Error {error}</div>
  }
}

const VirtualSensorWidget = ({ id, widget }: IVirtualSensorWidgetProps) => {
  try {
    const props = convertParametersToProps(widget.parameters)
    if (props.dataset === undefined || props.dataset === '') {
      throw 'dataset is required'
    }
  
    if (props.variable === undefined || props.variable === '') {
      throw 'variable is required'
    }
    return <AxiomVirtualSensorPlot {...props} />
  } catch (error) {
    return <div>Error {error}</div>
  }
}

const setPropertiesFromDotNotation = (
  t: any,
  path: string,
  value: any,
): any => {
  if (path == '') return value
  const [k, next] = path.split({
    [Symbol.split](s) {
      const i = s.indexOf('.')
      return i == -1 ? [s, ''] : [s.slice(0, i), s.slice(i + 1)]
    },
  })
  if (t !== undefined && typeof t !== 'object')
    throw Error(`cannot set property ${k} of ${typeof t}`)
  return Object.assign(t ?? (/^\d+$/.test(k) ? [] : {}), {
    [k]: setPropertiesFromDotNotation(t?.[k], next, value),
  })
}

function renderWidgets(id: string, widget: IWidget) {
  console.log('unparsed parameters', widget.parameters)
  const root = ReactDOM.createRoot(document.getElementById(id))
  const dotNotations = Object.entries(widget.parameters).filter(
    ([key, value]) => {
      const isDotNotation = !isNaN(parseInt(key))
      return isDotNotation
    },
  )
  const rows: any = {}
  dotNotations.forEach(([key, value]) => {
    const split = value.split('=')
    const propertyName = split[0]
    const propertyValue = split[1]
    rows[propertyName] = propertyValue
  })
  const parsedDotNotations = dot.object(rows)
  console.log('rows', dot.object(rows))
  widget.parameters = { ...widget.parameters, ...parsedDotNotations }
  Object.entries(widget.parameters).forEach(([key, value]) => {
    const isDotNotation = !isNaN(parseInt(key))
    if (isDotNotation) {
      delete widget.parameters[key]
    }
  })

  console.log('parsed parameters', widget.parameters)
  const widgetPaths: Record<string, JSX.Element> = {
    axiom_sensor: <SensorWidget id={id} widget={widget as ISensorWidget} />,
    axiom_virtual_sensor: <VirtualSensorWidget id={id} widget={widget as IVirtualSensorWidget} />,
    widget_1: <TestWidget id={id} widget={widget} />,
    widget_2: <TestWidget id={id} widget={widget} />,
  }
  root.render(
    <React.StrictMode>
      {widgetPaths[widget.type] !== undefined ? (
        widgetPaths[widget.type]
      ) : (
        <div>Widget not found</div>
      )}
    </React.StrictMode>,
  )
}

Object.keys(window.widgets).forEach((id) => {
  renderWidgets(id, window.widgets[id])
})
