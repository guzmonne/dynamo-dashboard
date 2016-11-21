import React, {PropTypes as T} from 'react'
import {TextField, ITextFieldProps} from 'office-ui-fabric-react/lib/TextField'

const ControlledTextField = ({input: {onChange, value}, textFieldProps}) => 
  <TextField onChanged={onChange} value={value} {...textFieldProps}/>

ControlledTextField.propTypes = {
  input: T.shape({
    onChange: T.func.isRequired,
    value: T.oneOfType([T.shape(ITextFieldProps), T.string]),
  }),
  textFieldProps: T.shape(ITextFieldProps)
}

export default ControlledTextField
