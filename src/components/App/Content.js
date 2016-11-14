import React, {PropTypes as T} from 'react'

class Content extends React.Component {
  static propTypes = {
    className: T.string,
  }
  
  render() {
    const {className, children} = this.props
    return (
      <div className={className}>
        {children}
      </div>
    )
  }
}

export default Content
