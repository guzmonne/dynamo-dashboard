import React, {PropTypes as T} from 'react'
import {Panel, PanelType} from 'office-ui-fabric-react'

const MediumPanel = ({isLightDismiss, header, isOpen, onDismiss, children}) =>
  <Panel isOpen={isOpen}
    onDismiss={onDismiss}
    type={PanelType.medium}
    headerText={header}
    isLightDismiss={isLightDismiss || true}
  >
    {children}
  </Panel>

MediumPanel.propTypes = {
  header: T.string,
  isOpen: T.bool,
  onDismiss: T.func.isRequired,
  isLightDismiss: T.bool,
}

export default MediumPanel
