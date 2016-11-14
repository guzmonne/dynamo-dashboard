import React from 'react'
import {Breadcrumb, IBreadcrumbItem} from 'office-ui-fabric-react'

const BreadCrumbs = ({items}) =>
  <Breadcrumb items={items} maxDisplayedItems={3}/>

BreadCrumbs.propTypes = Object.assign({}, IBreadcrumbItem)

export default BreadCrumbs
