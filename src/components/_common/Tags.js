import React, {PropTypes as T} from 'react'
import {BaseAutoFill} from 'office-ui-fabric-react/lib/components/pickers/AutoFill/BaseAutoFill.js'
import {FocusZone} from 'office-ui-fabric-react/lib/FocusZone'
import {TagItem} from 'office-ui-fabric-react/lib/components/pickers/'

class Tags extends React.Component {

  onInputFocus = (...args) => console.log('onInputFocus', ...args)

  onInputChange = (...args) => console.log('onInputChange', ...args)

  onRenderItem = (props) => (<TagItem { ...props }>{ props.item.name }</TagItem>)
  
  onKeyDown = (e) => {
    console.log(e.which)
    if (e)
      console.log('Enter!!!')
  }

  removeItem = (item) => console.log(item)

  renderItems = () => {
    console.log(this)
    const { items } = this.props;
    return items.map((item, index) => this.onRenderItem({
      item,
      index,
      key: index + item.key,
      selected: true,
      onRemoveItem: () => this.removeItem(item)
    }));
  }

  render() {
    const {inputProps} = this.props
    return (
      <div onKeyDown={this.onKeyDown}>
      <FocusZone className='ms-BasePicker-text'>
        { this.renderItems() }
        <BaseAutoFill
          { ...inputProps }
          className='ms-BasePicker-input'
          onFocus={ this.onInputFocus }
          onInputValueChange={ this.onInputChange }
          suggestedDisplayValue={ 'suggestedDisplayValue' }
          autoCapitalize='off'
          autoComplete='off'
          role='combobox' />
      </FocusZone>
      </div>      
    )
  }

}

Tags.propTypes = {
  items: T.arrayOf(T.object),
  onChange: T.func,
}

Tags.defaultProps = {
  onResolveSuggestions: () => {},
}

export default Tags
