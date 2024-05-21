import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

declare global {
  interface Window {
    renderGroups: any
  }
}

interface IGroupCardProps {
  uuid: string
  widget: IWidget
}
const GroupCard = ({ uuid, widget }: IGroupCardProps) => {
  return (
    <div>
      hi {uuid} {widget.type} {JSON.stringify(widget.parameters)}
    </div>
  )
}

interface IWidget {
  id: string
  type: string
  parameters: Record<string, string>
}

function renderGroups(uuid: string, widget: IWidget) {
  const root = ReactDOM.createRoot(document.getElementById(uuid))
  const widgetPaths: Record<string, JSX.Element> = {
    widget_1: <GroupCard uuid={uuid} widget={widget} />,
    widget_2: <GroupCard uuid={uuid} widget={widget} />,
  }
  // const routes = [
  //   {
  //     path: 'widget_1',
  //     element: <GroupCard uuid={uuid} />,
  //   },
  // ]
  // const router = createMemoryRouter(routes, {
  //   initialEntries: routes.map((route) => route.path),
  //   initialIndex: 1,
  // })
  root.render(
    <React.StrictMode>
      {/* <RouterProvider router={router} /> */}
      {widgetPaths[widget.type] !== undefined ? (
        widgetPaths[widget.type]
      ) : (
        <div>Widget not found</div>
      )}
    </React.StrictMode>,
  )
}

// window.renderGroups = renderGroups

Object.keys(window.widgets).forEach((uuid) => {
  renderGroups(uuid, window.widgets[uuid])
})
