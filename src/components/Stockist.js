import React, { Component, createRef } from 'react';
import { DB } from '../firebase.config';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
const stokistcollection = collection(DB, 'stokistdetails');

export default class Stockist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stokist: ''
    }
    this.loadlist = createRef()
  }

  updatestate = (stokist = '') => {
    this.setState({
      stokist: stokist
    })

  }

  render() {
    return (
      <div className="">

        <AddStokistForum loadlist={this.loadlist} stokist={this.state.stokist} editfunc={this.updatestate} />
        <StokistList loadlist={this.loadlist} editfunc={this.updatestate} />


      </div>
    )
  }
}

class AddStokistForum extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stokistname: '',
      address: '',
      mobile: '',

      addsuccess: false,
      addfailure: false,
    }
    this.reset = createRef()

  }

  formsubmit = async (e) => {
    e.preventDefault()
    const stokistname = this.state.stokistname;
    const address = this.state.address;
    const mobile = this.state.mobile;

    const stokistnametest = new RegExp('[0-9A-Za-z\'.,]+').test(stokistname)
    const addresstest = new RegExp('[0-9A-Za-z\'.,]+').test(address)
    const mobiletest = new RegExp('[0-9]{4,11}').test(mobile)

    console.log(stokistnametest, addresstest, mobiletest)

    if (stokistnametest && addresstest && mobiletest) {

      try {

        const status = await addDoc(stokistcollection, {
          stokistname,
          address,
          mobile,
        })
        console.log(status)
        this.reset.current.click()
        this.props.loadlist.current.click()
        this.setState({
          stokistname: '',
          address: '',
          mobile: '',

        })

        this.setState({
          addfailure: false,
          addsuccess: true,
        })

        setTimeout(() => {
          this.setState({
            addfailure: false,
            addsuccess: false,
          })
        }, 5000)


      } catch (error) {
        console.log(error.message)
        this.setState({
          addfailure: true,
          addsuccess: false,

        })

        setTimeout(() => {
          this.setState({
            addfailure: false,
            addsuccess: false,
          })
        }, 5000)
      }


    }
  }

  updatevalue = async (id) => {

    const stokistname = this.state.stokistname;
    const address = this.state.address;
    const mobile = this.state.mobile;

    const stokistnametest = new RegExp('[A-Za-z\'.,]+').test(stokistname)
    const addresstest = new RegExp('[0-9A-Za-z\'.,]+').test(address)
    const mobiletest = new RegExp('[0-9]{4,11}').test(mobile)

    console.log(stokistnametest, addresstest, mobiletest)
    const updatevalue = {}




    switch (stokistnametest) {
      case true:
        updatevalue['stokistname'] = stokistname

        break;
      default:
        break;
    }
    switch (addresstest) {
      case true:
        updatevalue['address'] = address

        break;
      default:
        break;
    }
    switch (mobiletest) {
      case true:
        updatevalue['mobile'] = mobile

        break;
      default:
        break;
    }


    if (stokistnametest || addresstest || mobiletest) {
      try {



        const newdoc = doc(DB, 'stokistdetails', id)
        console.log(updatevalue)
        const status = await updateDoc(newdoc, updatevalue)
        console.log(status)
        this.props.editfunc('')
        this.reset.current.click()
        this.props.loadlist.current.click()
        this.setState({
          stokistname: '',
          address: '',
          mobile: '',
        })


        this.setState({
          addfailure: false,
          addsuccess: true,
        })

        setTimeout(() => {
          this.setState({
            addfailure: false,
            addsuccess: false,
          })
        }, 5000)

      } catch (error) {
        console.log(error.message)
        this.setState({
          addfailure: true,
          addsuccess: false,

        })

        setTimeout(() => {
          this.setState({
            addfailure: false,
            addsuccess: false,
          })
        }, 5000)
      }



    }

  }

  addvalue = (e) => {
    this.setState({
      [e.target.name]: e.target.value.trim()
    })


  }


  render() {

    // console.log(datepattern)

    return (
      <div className="list w-[90%] mx-auto my-5">

        <form onSubmit={(e) => { this.formsubmit(e) }} method="get" encType="multipart/form-data" className="w-full  max-w-2xl m-auto space-y-5" >

          <div className="">
            <input autoFocus tabIndex={1} minLength={3} maxLength={100} className="text-white tracking-widest w-full outline-none px-5 py-3 bg-white/10 rounded-xl shadow-2xl capitalize" type="text" name="stokistname" id="stokistname" required placeholder={'Stokist Name . . .'} onChange={(e) => {
              this.addvalue(e)
            }} defaultValue={this.props.stokist.stokistname} />
          </div>

          <div className="flex flex-col space-y-5">

            <input tabIndex={2} maxLength={200} className="text-white tracking-widest w-full outline-none px-5 py-3 bg-white/10 rounded-xl shadow-2xl" type="text" name="address" id="address" required placeholder={'Address. . .'} onChange={(e) => { this.addvalue(e) }} defaultValue={this.props.stokist.address} />

            <input tabIndex={3} maxLength={10} className="text-white tracking-widest w-full outline-none px-5 py-3 bg-white/10 rounded-xl shadow-2xl" type="text" name="mobile" id="mobile" required placeholder={'Mobile No . . .'} onChange={(e) => { this.addvalue(e) }} defaultValue={this.props.stokist.mobile} />

          </div>

          <div className="flex ">

            {!this.props.stokist && <button tabIndex={4} type="submit" className="w-full text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 capitalize ">+ Add Stokist</button>}

            {this.props.stokist && <button tabIndex={4} type="button" onClick={() => { this.updatevalue(this.props.stokist.id) }} className="w-full text-white bg-cyan-500 shadow-lg  hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 capitalize ">+ Update Stokist</button>}

            {this.props.stokist && <button tabIndex={5} type="button" onClick={() => {
              this.props.editfunc('');
              this.setState({
                stokistname: '',
                address: '',
                mobile: '',
              })
            }} className="w-40 text-white bg-rose-500 shadow-lg  hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 capitalize ">Close</button>}

            <button className="hidden" type="reset" ref={this.reset}>reset</button>
          </div>

          {this.state.addsuccess && <p className="text-center w-full capitalize text-green-500">✅ Stokist Added / updated Successfully</p>}

          {this.state.addfailure && <p className="text-center w-full capitalize text-red-500">❌ Error Occured</p>}

        </form>

      </div>

    )
  }
}

class StokistList extends Component {


  constructor(props) {
    super(props);
    this.state = {
      stokistdetails: [],
      displaystokist: []
    }
  }

  async componentDidMount() {
    this.fetchstokistdetails()
  }

  fetchstokistdetails = async () => {
    const data = await getDocs(stokistcollection)
    console.log(data)
    this.setState({
      stokistdetails: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      displaystokist: data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    })

  }

  searchfilter = async (e) => {
    const searchvalue = e.target.value;
    if (searchvalue !== '' && this.state.stokistdetails.length > 0) {
      const searchresult = this.state.stokistdetails.filter((item) => {

        // for (const key in item) {
        return item['stokistname'].includes(searchvalue)

        // }

      })
      this.setState({
        displaystokist: searchresult
      })
      console.log(searchvalue)
      console.log(searchresult)
    } else {
      this.setState({
        displaystokist: this.state.stokistdetails
      })
    }
  }

  render() {
    return (
      <div className="list w-max mx-auto my-5 capitalize">
        <div className="w-96 mx-auto mb-5">
          <form>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input type="search" id="default-search" className="block p-2 pl-10 w-full text-base outline-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 " placeholder="Search Products" onChange={(e) => { this.searchfilter(e) }} />

            </div>
          </form>
        </div>
        <table className="w-max space-y-2 border-separate ">
          <thead className="w-full  text-blue-600 rounded-xl sticky top-[54px] bg-black z-50  ">
            <tr className="w-full flex flex-row justify-between items-center p-3  bg-black text-center border-b-2 border-b-indigo-500/50 relative capitalize">
              <td className="w-60 mx-5">stokist name</td>
              <td className="w-60 mx-5">address</td>
              <td className="w-60 mx-5">mobile</td>

              <td onClick={() => { this.fetchstokistdetails() }} ref={this.props.loadlist} className="mx-[25px] w-5  cursor-pointer absolute right-0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z" fill="white" /></svg></td>

            </tr>

          </thead>
          <tbody className="w-full  text-indigo-600 rounded-xl space-y-1">
            {
              this.state.displaystokist.map((elem, index) => {
                return <tr key={elem.id} data={index + 1} className={`w-full flex flex-row justify-between items-center p-3  rounded-xl ${(index % 2) ? 'bg-black/50' : 'bg-black/30'} text-center relative`}>
                  <td className="w-[25%] max-w-[200px] text-center break-words">{elem.stokistname}</td>
                  <td className="w-[50%] text-center">{elem.address}</td>
                  <td className="w-[25%] text-center">{elem.mobile}</td>

                  <td onClick={() => { this.props.editfunc(elem) }} className="mx-[25px]  cursor-pointer absolute right-0"><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 448 512"><path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM325.8 139.7C310.1 124.1 284.8 124.1 269.2 139.7L247.8 161.1L318.7 232.1L340.1 210.7C355.8 195 355.8 169.7 340.1 154.1L325.8 139.7zM111.5 303.8L96.48 363.1C95.11 369.4 96.71 375.2 100.7 379.2C104.7 383.1 110.4 384.7 115.9 383.4L176 368.3C181.6 366.9 186.8 364 190.9 359.9L296.1 254.7L225.1 183.8L119.9 288.1C115.8 293.1 112.9 298.2 111.5 303.8z" fill='white' /></svg></td>

                </tr>
              })}


          </tbody>
        </table>



      </div>

    )
  }
}

