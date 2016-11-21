import React, {PropTypes as T} from 'react'
import {Checkbox, ICheckboxProps} from 'office-ui-fabric-react/lib/Checkbox'

const ControlledCheckbox = ({input: {value, onChange}, checkboxProps}) =>
  <Checkbox checked={!!value} onChange={onChange} {...checkboxProps}/>

ControlledCheckbox.propTypes = {
  input: T.shape({
    onChange: T.func.isRequired,
    value: T.oneOfType([T.bool, T.string]),
  }),
  checkboxProps: T.shape(ICheckboxProps),
}

export default ControlledCheckbox
