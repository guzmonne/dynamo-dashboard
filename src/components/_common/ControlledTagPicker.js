import React, {PropTypes as T} from 'react'
import {TagPicker, ITagPickerProps} from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagPicker'
import uniqueId from 'lodash/uniqueId'
import isFunction from 'lodash/isFunction'

const ControlledTagPicker = ({input:{onChange}, transform, shouldNotResolve, tagPickerProps}) => {
  return (
    <TagPicker
      onChange={onChange}
      onResolveSuggestions={(name) => isFunction(shouldNotResolve) && shouldNotResolve(name) ? false :
        [{key: uniqueId('tag'), name: isFunction(transform) ? transform(name) : name}]}
      {...tagPickerProps}
    />
  )
}

ControlledTagPicker.propTypes = {
  input: T.shape({
    onChange: T.func.isRequired,
  }),
  transform: T.func,
  shouldNotResolve: T.func,
  tagPickerProps: T.shape(ITagPickerProps),
}

export default ControlledTagPicker
