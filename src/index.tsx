import React from 'react'
import ReactDOM from 'react-dom/client'
import { AxiomSensorPlot } from '@axdspub/axiom-charts'

declare global {
  interface Window {
    renderGroups: any
    widgets: Record<string, IWidget>
  }
}

interface IWidget {
  id: string
  type: string
  parameters: Record<string, any>
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

interface ISensorWidget extends IWidget {
  parameters: {
    station_id: string
    sensor_id: string
  }
}
interface ISensorWidgetProps {
  id: string
  widget: ISensorWidget
}
const SensorWidget = ({ id, widget }: ISensorWidgetProps) => {
  return (
    <AxiomSensorPlot
      stationId={parseInt(widget.parameters.station_id)}
      parameterGroupId={parseInt(widget.parameters.sensor_id)}
      timeBin='monthly'
    />
  )
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
  const root = ReactDOM.createRoot(document.getElementById(id))
  Object.entries(widget.parameters).forEach(([key, value]) => {
    const isNestedProperty = !isNaN(parseInt(key))
    if (isNestedProperty) {
      const split = value.split('=')
      const propertyName = split[0]
      const propertyValue = split[1]
      const newData: any = {}
      setPropertiesFromDotNotation(newData, propertyName, propertyValue)
      widget.parameters = { ...widget.parameters, ...newData }
      delete widget.parameters[key]
    }
  })
  console.log('parsed parameters', widget.parameters)
  const widgetPaths: Record<string, JSX.Element> = {
    sensor: <SensorWidget id={id} widget={widget as ISensorWidget} />,
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
