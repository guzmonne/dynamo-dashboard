import React from 'react'
import {BreadCrumbs} from '../_common/'

class Tables extends React.Component {
  items = [{
    text: 'Tables', key: 'Tables', onClick: () => {},
  }]

  render() {
    return (
      <div className="Tables">
        <BreadCrumbs items={this.items} />
      </div>
    )
  }
}

export default Tables