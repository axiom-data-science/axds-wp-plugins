import React from 'react'
import ReactDOM from 'react-dom/client'
import { AxiomSensorPlot } from '@axdspub/axiom-charts'

declare global {
  interface Window {
    renderGroups: any
  }
}

interface IWidget {
  id: string
  type: string
  parameters: Record<string, string>
}

interface ITestWidgetProps {
  id: string
  widget: IWidget
}
const TestWidget = ({ id, widget }: ITestWidgetProps) => {
  return (
    <div className='bg-slate-300 rounded-lg px-4 py-2'>
      Widget {id}
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

function renderWidgets(id: string, widget: IWidget) {
  const root = ReactDOM.createRoot(document.getElementById(id))
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
