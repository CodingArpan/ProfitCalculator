import React, { Component } from 'react'
import { utils, write, writeFile } from 'xlsx';
import { DB } from '../firebase.config';
import { collection, getDocs, getDoc, setDoc, doc } from 'firebase/firestore';
const productcollection = collection(DB, 'productdetails');
const stokistcollection = collection(DB, 'stokistdetails');



export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stokistdetails: [],
      stokistlist: [],
      stokistaddedtoreport: [],
      productdetails: [],
      productlist: [],
      datauploadsuccess: false,
      datauploadfail: false,
      salequanlist: []
    }
    document.addEventListener('keydown', (e) => {

      console.log(e)
      if (e.key.toLowerCase() === 's' && e.ctrlKey) {
        e.preventDefault();
        this.uploadupdateddata()
      }

    })

  }

  async componentDidMount() {

    this.findreportdata(`${new Date().getFullYear()}-0${new Date().getMonth() + 1}`)
    setInterval(() => {
      this.updatetotalquantity()

    }, 1000);
  }

  findreportdata = async (docid) => {
    const docRef = doc(DB, "allreports", docid);
    const qeryreport = await getDoc(docRef);

    if (qeryreport.exists()) {

      // console.log(qeryreport.data());
      const report = qeryreport.data();



      const productdetails = report.fullreport.allproducts;
      const data = await getDocs(productcollection)
      const productsdata = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      const newproducts = productsdata.filter((product) => {

        return !JSON.stringify(productdetails).includes(product.id)

      })
      // console.log(newproducts)
      const updatedproductdetails = productdetails.concat(newproducts)
      this.setState({
        productdetails: updatedproductdetails,
        productlist: updatedproductdetails,
      })






      const reportstokistwise = report.fullreport.reportdata;
      // console.log(reportstokistwise)

      for (const stokistdata of reportstokistwise) {

        const addrow = []
        for (const product of newproducts) {
          const row = {
            "totalpurchase": 0,
            "totalsale": 0,
            "totalquantity": 0,
            "totaldiscount": 0,
            "totalprofit": 0,
            "purchaserate": product.purchase,
            "salerate": product.sale,
            "productid": product.id
          }
          addrow.push(row);

        }

        stokistdata.report = stokistdata.report.concat(addrow)
        // console.log(stokistdata)
      }
      // console.log(reportstokistwise)

      const fetchstokistdetails = await getDocs(stokistcollection)
      const allstokistdetails = fetchstokistdetails.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const remainstokists = allstokistdetails.filter((stokist) => {

        return !JSON.stringify(reportstokistwise).includes(stokist.id)

      })
      // console.log(remainstokists)










      this.setState({
        stokistdetails: reportstokistwise,
        stokistaddedtoreport: reportstokistwise,
        stokistlist: remainstokists
      })



    } else {
      this.setState({
        stokistdetails: [],
        stokistlist: [],
        stokistaddedtoreport: [],
        productdetails: [],
        productlist: [],
        datauploadsuccess: false,
        datauploadfail: false,
        salequanlist: []
      })
      this.fetchstokistdetails()
      this.fetchproductdetails()

      console.log('not exist')
    }
  }

  uploadupdateddata = async () => {

    try {



      const productlist = document.querySelectorAll('.productlist  .table  .table-row-group  .table-row')
      const month = document.querySelector('input#reportmonth').value
      const allproducts = []
      if (productlist) {

        for (const row of productlist) {

          const rowid = row.getAttribute('data-product_id')
          const lastmodified = row.querySelector('div:nth-child(1)').innerText;
          const productname = row.querySelector('div:nth-child(2)').innerText;
          const purchase = Number(row.querySelector('div:nth-child(3) input[name=purchaserate]').value);
          const sale = Number(row.querySelector('div:nth-child(4) input[name=salerate]').value);

          const newrow = {
            "modifydate": lastmodified,
            "purchase": purchase,
            "sale": sale,
            "productname": productname,
            "id": rowid
          }
          allproducts.push(newrow);

        }

      }



      const productperstokistlist = document.querySelectorAll('.sale_purchase_report .table')
      // console.log(productperstokistlist)
      const reportdata = []

      if (productperstokistlist) {

        for (const table of productperstokistlist) {

          const stokistid = table.getAttribute('data-stokist_id')
          const stokist_name = table.getAttribute('data-stokist_name')
          const stokist_address = table.getAttribute('data-stokist_address')
          const stokistwisereport = {
            "address": stokist_address,
            "stokistname": stokist_name,
            "id": stokistid,
            "report": []
          }
          const tablerows = table.querySelectorAll(".table-row-group  .table-row")
          for (const row of tablerows) {

            const rowproductid = row.getAttribute('data-product_id');
            const rowproductpurchase = Number(row.getAttribute('data-product_purchase'));
            const rowproductsale = Number(row.getAttribute('data-product_sale'));
            const quantity = Number(row.querySelector('div:nth-child(1) input[name=quantity]').value);
            const discount = Number(row.querySelector('div:nth-child(2) input[name=discount]').value);
            const purchase = Number(row.querySelector('div:nth-child(3) input[name=purchase]').value);
            const sale = Number(row.querySelector('div:nth-child(4) input[name=sale]').value);
            const profit = Number(row.querySelector('div:nth-child(5) input[name=profit]').value);

            stokistwisereport['report'].push({

              totalpurchase: purchase,
              totalsale: sale,
              totalquantity: quantity,
              totaldiscount: discount,
              totalprofit: profit,
              purchaserate: rowproductpurchase,
              salerate: rowproductsale,
              productid: rowproductid,

            })
          }
          reportdata.push(stokistwisereport)
        }

      }



      const buildreport = {
        month: month,
        fullreport: {
          allproducts,
          reportdata
        }
      }

      // console.log(buildreport)


      const status = await setDoc(doc(DB, 'allreports', month), buildreport)
      console.log(status)
      this.setState({
        datauploadsuccess: true,
        datauploadfail: false
      })

      setTimeout(() => {
        this.setState({
          datauploadsuccess: false,
          datauploadfail: false
        })
      }, 5000);


    } catch (error) {
      console.log(error.message)

      this.setState({
        datauploadsuccess: false,
        datauploadfail: true

      })

      setTimeout(() => {
        this.setState({
          datauploadsuccess: false,
          datauploadfail: false
        })
      }, 5000);

    }



  }

  fetchstokistdetails = async () => {
    const data = await getDocs(stokistcollection)
    // console.log(data)
    this.setState({
      stokistdetails: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      stokistlist: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      stokistaddedtoreport: [],
    })

  }

  fetchproductdetails = async () => {
    const data = await getDocs(productcollection)
    // console.log(data)
    this.setState({
      productdetails: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      productlist: data.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    })

  }

  addstokisttoreport = async () => {
    const stokistid = document.getElementById('stokisttoreport').value;
    console.log(stokistid)
    if (stokistid !== 'Choose Stockist') {

      const index = this.state.stokistlist.findIndex((stokist) => {
        return stokist.id === stokistid
      })
      const stokistaddedtoreport = this.state.stokistlist[index]

      const stokistlist = this.state.stokistlist.filter((stokist) => {
        return stokist.id !== stokistid
      })

      this.setState({
        stokistaddedtoreport: [...this.state.stokistaddedtoreport, stokistaddedtoreport],
        stokistlist: stokistlist
      })

    }



  }

  updateproductdata = (key, purchase, sale) => {

    console.log(key, purchase, sale)
    const productsarray = this.state.productlist;
    const productindex = productsarray.findIndex((product) => {
      return product.id === key
    })
    console.log(productindex)
    productsarray[productindex].purchase = purchase
    productsarray[productindex].sale = sale
    this.setState({
      productlist: productsarray,
    })



  }

  updatetotalquantity = () => {
    const alltables = document.querySelectorAll('.sale_purchase_report .table')
    // console.log(alltables)

    if (alltables.length > 0) {


      const all = []


      for (const table of alltables) {
        const allrows = table.querySelectorAll('.table-row input[name=quantity]')
        // console.log(allrows)
        const onetable = []
        for (const val of allrows) {
          const quan = Number(val.value);
          // console.log(quan)
          onetable.push(quan)
        }
        all.push(onetable)
      }

      // console.log(all)

      let totalquantitylist = []

      for (let i = 0; i < all[0].length; i++) {
        let val = 0;
        for (let v = 0; v < all.length; v++) {
          val += all[v][i]

        }
        totalquantitylist.push(val)


      }
      // console.log(totalquantitylist)

      this.setState({
        salequanlist: totalquantitylist
      })


    }



  }

  create_excel = async () => {
    const docid = document.querySelector('input#reportmonth').value;
    const docRef = doc(DB, "allreports", docid);
    const docreport = await getDoc(docRef);
    if (docreport.exists()) {

      const report = docreport.data().fullreport;
      // console.log(report);



      const arrayofoarray = []


      let heading = ['Product Name', 'Purchase Rate', 'Sale Rate', '****']
      for (const stokist of report.reportdata) {
        const stokistwise_header = ['Quantity', 'Discount', 'Total Purchase Price For GP', 'Total Sale Price For GP', 'Product Wise Profit', '****']
        heading = heading.concat(stokistwise_header)
        console.log(stokist)

      }
      arrayofoarray.push(heading);


      // console.log(arrayofoarray)


      for (const product of report.allproducts) {
        const row = [product.productname, product.purchase, product.sale, '****']
        arrayofoarray.push(row);

      }

      // console.log(arrayofoarray)

      const dataarray = []
      for (const stokist of report.reportdata) {
        let i = 0;
        for (const data of stokist.report) {
          const rowstokistdata = [data.totalquantity, data.totaldiscount, data.totalpurchase, data.totalsale, data.totalprofit, '****'];

          if (!dataarray[i]) {
            dataarray.push([]);
          }
          dataarray[i] = dataarray[i].concat(rowstokistdata);
          i++;
        }
      }

      // console.log(dataarray)



      let p = 1;
      const newarrofarr = [arrayofoarray[0]]
      for (let i = 0; i < dataarray.length; i++) {
        const newarr = arrayofoarray[p].concat(dataarray[i])
        newarrofarr.push(newarr)
        p++
      }


      console.log(newarrofarr)




















      const workbook = utils.book_new();
      var worksheet = utils.aoa_to_sheet(newarrofarr);
      utils.book_append_sheet(workbook, worksheet, docid);
      write(workbook, { bookType: 'xlsx', type: 'buffer' })
      write(workbook, { bookType: 'xlsx', type: 'binary' })
      writeFile(workbook, `${docid} glacier pharma profit report.xlsx`)

      console.log('downloaded')

    } else {
      console.log('no data found')
    }
  }

  render() {

    return (
      <>

        <div onClick={() => { this.create_excel() }} className="month absolute bottom-5 left-10 z-50 flex justify-center items-center space-x-3 cursor-pointer hover:bg-black py-1 px-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 512 512"><path d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z" fill="orange" /></svg>
          <div className="text-sm capitalize text-white font-bold tracking-widest">Download Excel file</div>

        </div>


        <div className="savebutton absolute top-2 left-10 z-50 flex justify-center items-center space-x-3">
          <button tabIndex="-1" onClick={() => { this.uploadupdateddata() }} type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-base px-8 py-2 text-center mr-2 mb-2 ">Save</button>
          {this.state.datauploadsuccess && <div className="text-green-500 capitalize">✅ Saved Successfully</div>}
          {this.state.datauploadfail && <div className="text-red-500 capitalize">❌ Can not save ,try agan later</div>}
        </div>


        <div className="month absolute top-2 right-10 z-50 flex justify-center items-center space-x-3">
          <label htmlFor="reportmonth" className="text-orange-500">Choose Month</label>
          <input tabIndex="1" type="month" className="w-40 py-1 px-5 border-b-2 text-black capitalize outline-none bg-white rounded-full focus:outline-4 focus:outline-amber-500" name="reportmonth" id="reportmonth" defaultValue={`${new Date().getFullYear()}-0${new Date().getMonth() + 1}`} required onChange={(e) => { this.findreportdata(e.target.value) }} />
        </div>


        <div className="window w-full h-[calc(100vh-54px)] overflow-y-scroll overflow-x-scroll flex flex-row  relative ">

          <div className="z-20 productlist w-[480px] h-max sticky left-0 bg-[#242527]">

            <div className="table table-fixed w-[480px] text-white/60  border-r-4 border-indigo-600 ">

              <div className="w-full sticky top-0 table-header-group ">
                <div className="w-full table-row bg-black text-center leading-[0.9]">
                  <div className="w-max table-cell capitalize py-2 border-b-4 border-indigo-600 text-xs">Last Modified <br /><span className="text-[10px]"> YYYY-MM-DD</span></div>
                  <div className="w-6/12 table-cell capitalize py-3 border-b-4 border-indigo-600">Product Name</div>
                  <div className="w-2/12 table-cell capitalize py-3 border-b-4 border-indigo-600">₹ Purchase</div>
                  <div className="w-2/12 table-cell capitalize py-3 border-b-4 border-indigo-600">₹ Sale</div>
                </div>

              </div>

              <div className="w-full table-row-group space-y-2 ">

                {this.state.productlist.map((product, index) => {
                  return <Productrow key={product.id} product={product} index={index} updatelist={this.updateproductdata} />
                })}

              </div>

              <div className="w-full table-footer-group space-y-2 text-center bg-[#3730a3] text-black sticky bottom-0">
                <div className="table-row">
                  <div className="h-[33px]  table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate"></div>
                  <div className="h-[33px]  table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate"></div>
                  <div className="h-[33px]  table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate"></div>
                  <div className="h-[33px]  table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate"></div>

                </div>
              </div>

            </div>

          </div>


          {this.state.stokistaddedtoreport.length > 0 ? <div className="z-20 quantitysum w-max h-max sticky left-[480px] bg-[#242527]">

            <div className="table table-fixed w-max text-white/60  border-x-4  border-indigo-600 ">

              <div className="w-full sticky top-0 table-header-group ">
                <div className="w-full table-row bg-black text-center leading-[0.9]">
                  <div className="w-6/12 h-[56px] table-cell capitalize py-3 px-3 border-b-4 border-indigo-600">total Sale quantity</div>
                </div>

              </div>

              <div className="w-full table-row-group space-y-2 ">
                {this.state.salequanlist.map((quan, index) => {
                  return <div key={index} className={`h-[38px] table-row ${index % 2 === 0 ? 'bg-[#3730a3]/60' : 'bg-[#3730a3]'}`}>
                    <div className="table-cell py-1 px-2 text-center">{quan}</div>
                  </div>

                })}

              </div>

              <div className="w-full table-footer-group space-y-2 text-center bg-[#3730a3] text-black sticky bottom-0">
                <div className="table-row">
                  <div className="h-[33px]  table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate"></div>
                </div>
              </div>
            </div>

          </div> : null}


          <div className="sale_purchase_report w-[calc(100vw-600px)] h-max  relative flex flex-row">

            {this.state.stokistaddedtoreport.map((stokist) => {

              return <Report key={stokist.id} productlist={stokist.report || this.state.productlist} stokist={stokist} />

            })}


            {this.state.stokistlist.length > 0 ? <div className=" w-max h-max bg-black flex flex-row justify-evenly items-center px-5 py-5 space-x-4 rounded-lg  sticky top-0">



              <select tabIndex="-2" className="w-60 p-2 rounded-xl text-black capitalize outline-none focus:outline-4 focus:outline-amber-500" name="stokisttoreport" id="stokisttoreport" defaultValue="Choose Stockist" required>

                <option disabled value="Choose Stockist">Choose Stockist</option>
                {this.state.stokistlist.map((stokist) => {

                  return <option key={stokist.id} value={stokist.id}>{stokist.stokistname + ' - ' + stokist.address}</option>

                })}
              </select>

              <div tabIndex="-3" onClick={() => { this.addstokisttoreport() }} className="text-base text-center text-white  bg-indigo-600 hover:bg-rose-500 px-5 py-2 rounded-full cursor-pointer w-max focus:outline-4 focus:outline-amber-500">+ Add</div>


            </div> : null}


          </div>



        </div>

      </>

    )
  }

}

class Productrow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      key: this.props.product.id,
      purchase: this.props.product.purchase,
      sale: this.props.product.sale,
    }
  }

  updatepurchase(e) {
    this.setState({ purchase: e.target.value })

    this.props.updatelist(this.state.key, e.target.value, this.state.sale)

  }

  updatesale(e) {
    this.setState({ sale: e.target.value })

    this.props.updatelist(this.state.key, this.state.purchase, e.target.value)

  }

  render() {



    return (
      <div className={`z-10 table-row ${(this.props.index % 2) === 0 ? 'bg-indigo-800/70' : 'bg-indigo-800'} `} data-product_id={this.props.product.id}>

        <div className="table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none text-xs">{this.props.product.modifydate}</div>

        <div className=" table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate ">{this.props.product.productname}</div>



        <div onDoubleClick={(e) => { e.target.disabled = false }} onBlur={(e) => { e.target.disabled = true }} className="table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none"><input disabled={true} maxLength="6" className="w-full h-full bg-transparent text-center outline-5 outline-amber-500 hover:cursor-pointer" placeholder="0" type="text" name='purchaserate' id='' defaultValue={this.state.purchase} onChange={(e) => {
          this.updatepurchase(e)
        }} /></div>



        <div onDoubleClick={(e) => { e.target.disabled = false }} onBlur={(e) => { e.target.disabled = true }} className="table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none"><input disabled={true} maxLength="6" className="w-full h-full bg-transparent text-center outline-5 outline-amber-500 hover:cursor-pointer " placeholder="0" type="text" name='salerate' id='' defaultValue={this.state.sale} onDoubleClick={(e) => { console.log(e) }} onChange={(e) => {
          this.updatesale(e)
        }} /></div>

      </div>
    )
  }
}

let tabindexstart = 1;

class Report extends Component {


  constructor(props) {
    super(props);
    this.state = {
      tprofit: 0,
      tsale: 0,
      tpurchase: 0,
    }
  }


  updategross = () => {
    const allrow = document.querySelectorAll(`.table[data-stokist_id=${this.props.stokist.id}] .table-row-group .table-row`)
    // console.log(allrow)
    let totalprofit = 0;
    let totalpurchase = 0;
    let totalsale = 0;
    for (const row of allrow) {

      const purchase = Number(row.querySelector('div:nth-child(3) input[name=purchase]').value);
      const sale = Number(row.querySelector('div:nth-child(4) input[name=sale]').value);
      const profit = Number(row.querySelector('div:nth-child(5) input[name=profit]').value);
      totalprofit += profit
      totalpurchase += purchase
      totalsale += sale
    }

    // console.log(totalprofit,
    //   totalpurchase,
    //   totalsale)


    this.setState({
      tprofit: totalprofit,
      tsale: totalsale,
      tpurchase: totalpurchase,
    })



  }

  componentDidMount() {
    setInterval(() => {
      this.updategross()
      // console.log('first')

    }, 1000);
  }




  render() {
    return (
      <div className="table table-fixed w-[500px]  text-white/60  border-r-4 border-violet-600" data-stokist_id={this.props.stokist.id} data-stokist_name={this.props.stokist.stokistname} data-stokist_address={this.props.stokist.address}>

        <div className="w-[500px] sticky top-0 table-caption bg-black text-center truncate border-b-4 border-indigo-600 border-r-4 border-r-violet-600 px-3 ">

          {this.props.stokist.stokistname} - {this.props.stokist.address}

        </div>

        <div className="w-full sticky top-[28px]  table-header-group ">
          <div className="w-full table-row bg-black text-center ">
            <div className=" table-cell capitalize border-b-4 border-indigo-600"> Quantity</div>
            <div className=" table-cell capitalize border-b-4 border-indigo-600">% Discount</div>
            <div className=" table-cell capitalize border-b-4 border-indigo-600">₹ Purchase</div>
            <div className=" table-cell capitalize border-b-4 border-indigo-600">₹ Sale</div>
            <div className=" table-cell capitalize border-b-4 border-indigo-600">₹ Profit</div>
          </div>


        </div>

        <div className="w-full table-row-group space-y-2 ">

          {this.props.productlist.map((product, index) => {

            tabindexstart++

            return <Datarow key={product.productid} product={product} tabindexstart={tabindexstart} index={index} />

          })}

        </div>

        <div className="w-full table-footer-group space-y-2 text-center bg-[#3730a3] text-white font-bold sticky bottom-0">
          <div className="table-row">
            <div className="h-[33px]  table-cell py-2 px-1 capitalize break-words border-b border-b-indigo-600 leading-none truncate">Total</div>
            <div className="h-[33px]  table-cell py-2 px-1 capitalize break-words border-b border-b-indigo-600 leading-none truncate"> --</div>
            <div className="h-[33px]  table-cell py-2 px-1 capitalize break-words border-b border-b-indigo-600 leading-none truncate">₹{this.state.tpurchase}</div>
            <div className="h-[33px]  table-cell py-2 px-1 capitalize break-words border-b border-b-indigo-600 leading-none truncate">₹{this.state.tsale}</div>
            <div className="h-[33px]  table-cell py-2 px-1 capitalize break-words border-b border-b-indigo-600 leading-none truncate ">₹{this.state.tprofit}</div>
          </div>
        </div>

      </div>
    )
  }
}

class Datarow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      totalpurchase: this.props.product.totalpurchase || 0,
      totalsale: this.props.product.totalsale || 0,
      totalquantity: this.props.product.totalquantity || 0,
      totaldiscount: this.props.product.totaldiscount || 0,
      totalprofit: this.props.product.totalprofit || 0,
      purchaserate: this.props.product.purchaserate || this.props.product.purchase,
      salerate: this.props.product.salerate || this.props.product.sale,
      productid: this.props.product.productid || this.props.product.id

    }

  }


  render() {

    return (
      <div className={`z-10 table-row ${(this.props.index % 2) === 0 ? 'bg-black/20' : 'bg-black/40'} `} data-product_id={this.state.productid} data-product_purchase={this.state.purchaserate} data-product_sale={this.state.salerate}>

        <div className="h-[33px]  table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none truncate " > <input tabIndex={this.props.tabindexstart + 1} defaultValue={this.props.product.totalquantity || null} maxLength="6" className="w-full h-full bg-transparent text-center outline-5 outline-amber-500" placeholder="0" type="text" name='quantity' id='' onChange={(e) => {
          this.setState({
            totalquantity: Number(e.target.value) || 0,
            totalpurchase: Number(e.target.value) * Number(this.state.purchaserate),
            totalsale: (((quan, sale) => {
              if (quan === '') {

                return 0

              } else if (this.state.totaldiscount === 0) {

                return Number(quan) * Number(sale)

              } else if (this.state.totaldiscount !== 0) {

                return (Number(quan) * Number(sale)) - ((Number(quan) * Number(sale)) * (this.state.totaldiscount / 100))


              }
            })(e.target.value, this.state.salerate)).toFixed(2),
            totalprofit: (((quan, sale) => {
              if (quan === '') {

                return 0

              } else if (this.state.totaldiscount === 0) {

                return Number(quan) * Number(sale)

              } else if (this.state.totaldiscount !== 0) {

                return (Number(quan) * Number(sale)) - ((Number(quan) * Number(sale)) * (this.state.totaldiscount / 100))


              }
            })(e.target.value, this.state.salerate) - (Number(e.target.value) * Number(this.state.purchaserate))).toFixed(2),
          })


        }} /> </div>

        <div className="h-[33px] table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none"><input tabIndex={this.props.tabindexstart + 1} defaultValue={this.props.product.totaldiscount || null} maxLength="2" className=" w-full h-full bg-transparent text-center outline-5 outline-amber-500" placeholder="0" type="text" name="discount" id="" onChange={(e) => {

          this.setState({

            totaldiscount: Number(e.target.value) || 0,

            totalsale: (((disc, quan, sale) => {
              if (disc === '') {
                return (quan * sale)
              }
              else if (this.state.totalsale !== 0) {

                return ((quan * sale) - ((quan * sale) * (Number(disc) / 100)))


              } else {
                return 0
              }

            })(e.target.value, this.state.totalquantity, this.state.salerate)).toFixed(2),

            totalprofit: (((disc, quan, sale) => {
              if (disc === '') {
                return (quan * sale)
              }
              else if (this.state.totalsale !== 0) {

                return ((quan * sale) - ((quan * sale) * (Number(disc) / 100)))


              } else {
                return 0
              }

            })(e.target.value, this.state.totalquantity, this.state.salerate) - this.state.totalpurchase).toFixed(2),

          })

        }} /></div>



        <div className="h-[33px] table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none"><input disabled className="text-gray-500 w-full h-full bg-transparent text-center" type="text" name="purchase" id="" value={this.state.totalpurchase} /></div>

        <div className="h-[33px] table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none"><input disabled className="text-gray-500 w-full h-full bg-transparent text-center" type="text" name="sale" id="" value={this.state.totalsale} /></div>

        <div className="h-[33px] table-cell py-2 px-2 capitalize break-words border-b border-b-indigo-600 leading-none"><input disabled className="text-gray-500 w-full h-full bg-transparent text-center" type="text" name="profit" id="" value={this.state.totalprofit} /></div>

      </div>

    )
  }

}

