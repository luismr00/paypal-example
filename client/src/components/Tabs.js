import React from 'react'

const Tabs = ({setTab}) => {
  return (
    <div className='tabs'>
        <button className='button' onClick={() => setTab("pay")}>Pay</button>
        <button className='button' onClick={() => setTab("cancel")}>Cancel</button>
    </div>
  )
}

export default Tabs