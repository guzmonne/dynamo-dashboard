import React, {PropTypes as T} from 'react'
import {Panel as PanelUi, PanelType} from 'office-ui-fabric-react'

const Panel = ({isLightDismiss, header, isOpen, onDismiss, type, children}) =>
  <PanelUi isOpen={isOpen}
    onDismiss={onDismiss}
    type={PanelType[type]}
    headerText={header}
    isLightDismiss={isLightDismiss || true}
  >
    {children}
  </PanelUi>

Panel.propTypes = {
  header: T.string,
  isOpen: T.bool,
  onDismiss: T.func.isRequired,
  isLightDismiss: T.bool,
  type: T.string,
}

Panel.defaultProps = {
  type: 'medium',
}

export default Panel
