import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: false,
            stokist: false,
            dashboard: true
        }
    }

    render() {

        const active = 'border-b-2 text-blue-600 border-blue-600'
        const inactive = 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-400'


        return (

            <div className="bg-black  z-50 sticky top-0 w-full m-auto border-b border-gray-200 dark:border-gray-700">
                <ul className="w-max m-auto flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">

                    <Link to='/' > <li onClick={() => {
                        this.setState({
                            product: false,
                            stokist: false,
                            dashboard: true
                        })
                    }} className="mr-2 capitalize cursor-pointer">
                        <p className={`inline-flex p-4 rounded-t-lg ${this.state.dashboard ? active : inactive} `} aria-current="page">
                            <svg className="mr-2 w-5 h-5  " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>dashboard
                        </p>
                    </li></Link>
                    <Link to='/s'>  <li onClick={() => {
                        this.setState({
                            product: false,
                            stokist: true,
                            dashboard: false
                        })
                    }} className="mr-2 capitalize cursor-pointer">
                        <p className={`inline-flex p-4 rounded-t-lg ${this.state.stokist ? active : inactive} `}>
                            <svg className="mr-2 w-5 h-5 " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>add stockist
                        </p>
                    </li></Link>
                    <Link to='/p'> <li onClick={() => {
                        this.setState({
                            product: true,
                            stokist: false,
                            dashboard: false
                        })
                    }} className="mr-2 capitalize cursor-pointer">
                        <p className={`inline-flex p-4 rounded-t-lg ${this.state.product ? active : inactive} `}>


                            <svg className="mr-2 w-5 h-5  " fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>add product
                        </p>
                    </li></Link>

                </ul>
            </div>

        )
    }
}
