import React, {PropTypes as T} from 'react'
import {Dropdown, IDropdownOption, IDropdownProps} from 'office-ui-fabric-react/lib/Dropdown'

const ControlledDropdown = ({input: {value, onChange}, options, dropdownProps}) =>
  <Dropdown
    options={options.map(option => {
      return Object.assign({}, option, {
        isSelected: value && option.key === value
      })
    })}
    onChanged={onChange}
    {...dropdownProps}
  />

ControlledDropdown.propTypes = {
  input: T.shape({
    onChange: T.func.isRequired,
    value: T.oneOfType([T.shape(IDropdownOption), T.string]),
  }),
  options: T.arrayOf(T.shape(IDropdownOption)).isRequired,
  dropdownProps: T.shape(IDropdownProps),
}

export default ControlledDropdown
