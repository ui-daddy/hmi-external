import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GatwayClientService } from '../service/gateway/gatway-client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as moment from "moment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = 'Kiran'
  dashList = [1, 2, 3, 4]
  status: any = "Shipment started";
  status1: boolean = false;
  status2: boolean = false;
  status3: boolean = false;
  status4: boolean = false;
  status5: boolean = false;
  status6: boolean = false;
  index: number = 0;
  interval: any;
  shipping_type: any;
  location_of_the_ship_to_party: any;
  delivery: any;
  forwarding_agent_name: any;
  forward_agent_name: any;
  country_of_origin: any;
  loading_date: any;
  consignee: any;
  listData: any[] = [];
  old_list: any[] = [];
  mode: any;
  postalcode: any;
  total_weight: any;
  city: any;
  shipment_status: any;
  websiteList: any = ['1-10', '11-20', '21-30']
  page: number = 1;
  totaldata: number = 0;
  count: number = 0;
  carrier: any;

  // New Pagination variables ...
  Page = 1;
  Count = 0;
  PageSize = 10;
  PageSizes = [10, 20, 50];
  currentIndex = -1;
  Data: any[] = [];

  constructor(private chdt: ChangeDetectorRef, private http: HttpClient, private gateway: GatwayClientService) { }

  ngOnInit(): void {
    this.getData()
    this.interval = setInterval(() => {
      // console.log("hello ==>", this.index>6 === false);
      if (this.index > 6 === false) {
        this.index = this.index + 1;
        // console.log("increament ==>", this.index)
        switch (this.index) {
          case 1:
            this.status1 = true;
            this.status = "Shipment started"
            break;
          case 2:
            this.status2 = true;
            this.status = "In Transit"
            break;
          case 3:
            this.status3 = true;
            this.status = "Delivered"
            break;
          // case 4:
          //   this.status4 = true;
          //   break;
          // case 5:
          //   this.status5 = true;
          //   break;
          // case 6:
          //   this.status6 = true;
          //   break;
        }
        // this.dashList =[1,2,3,4]
      } else {
        clearInterval(this.interval);
      }
    }, 4000); // 4000 ms = start after 4sec
  }

  doStuff() {
    console.log("hello ==>", this.index);
    this.dashList = []

    //  this.chdt.detectChanges();
  }
  ShowDetails(item: any) {
    this.listData.map((data: any) => {
      if (data.consignee === item.consignee) {
        data.show = data.show ? false : true;
        data.shipmentDetalsShow = data.shipmentDetalsShow ? false : true;
      } else {
        data.shipmentDetalsShow = false;
        data.show = false;
      }
      data.status_scanShow = false;
    });
  }
  viewDetails(item: any, type: any) {
    console.log(type, item);
    this.listData.map((data: any) => {
      if (type === 'shipment') {
        if (data.consignee === item.consignee) {
          data.shipmentDetalsShow = data.shipmentDetalsShow ? false : true;
          data.status_scanShow = false;
        } else {
          data.shipmentDetalsShow = false;
          data.status_scanShow = false;
        }

      } else if (type === 'scan') {
        if (data.consignee === item.consignee) {
          data.shipmentDetalsShow = false;
          data.status_scanShow = data.status_scanShow ? false : true;
        } else {
          data.shipmentDetalsShow = false;
          data.status_scanShow = false;
        }
      }
    });
  }
  getData() {

    let body = {
      "mode": "",
      "ship_to_party": "",
      "delivery": "",
      "carieer": "",
      "country_of_origin": "",
      "location_of_the_ship_to_party": "",
      "loading_date": "",
      "forward_agent_name": "",
      "total_weight": "",
      "street": "",
      "postalcode": "",
      "shipment_status": "",
      "city": ""
    }

    this.listData = [];
    this.old_list = [];
    this.gateway.postMethod(`${environment.baseurl}/api/auth/getdata?pagesize=${this.PageSize}&page=${this.Page}`, body).then((data: any) => {
      // console.log('response ==>', data);
      this.Count = data.results.total;
      this.Data = data.results.data;
      console.log(this.Data, "DATASHIPMENT");
      let index = 0;
      this.Data.map((tbl: any) => {
        console.log(tbl);
        let orderfilelen = tbl.masterfile.orderfile ? tbl.masterfile.orderfile.length : 0;
        let jsn = {
          show: false,
          shipmentDetalsShow: false,
          status_scanShow: false,
          shipmentDetals: [
            {
              country_of_origin: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].country_of_origin : "",
              location_of_the_ship_to_party: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].location_of_the_ship_to_party : "",
              forward_agent: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].forward_agent : "",
              forward_agent_name: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].forward_agent_name : "",
              postalcode: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].postalcode : "",
              street: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].street : "",
              total_weight: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].total_weight : "",
              delivery: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].delivery : "",
              city: (tbl.masterfile.orderfile && tbl.masterfile.orderfile[orderfilelen - 1].city) ? tbl.masterfile.orderfile[orderfilelen - 1].city : "", shipment_status: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].shipment_status : ""
              // consignee: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].consignee : ""

            }
          ],
          status_scan: [
            // {
            //   location_of_the_ship_to_party: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].location_of_the_ship_to_party : "",
            //   shippingtime: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].shippingtime : "",
            //   loading_date: tbl.masterfile.orderfile != null ? moment(tbl.masterfile.orderfile[0].loading_date).format('YYYY/MM/DD') : "",
            //   // let toDate = moment(new Date(this.events.todate)).format("YYYY-MM-DD");
            //   shipment_status: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].shipment_status : "",
            // }
          ],
          mode: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].shipping_type : "",
          forward_agent_name: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].forward_agent_name : "",
          country_of_origin: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].country_of_origin : "",
          location_of_the_ship_to_party: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].location_of_the_ship_to_party : "",
          // consignee: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].consignee + " " + index++ : "",
          loading_date: tbl.masterfile.orderfile != null ? moment(tbl.masterfile.orderfile[0].loading_date).format('YYYY/MM/DD') : "",
          shippingtime: tbl.masterfile.orderfile[0].shippingtime ? tbl.masterfile.orderfile[0].shippingtime : "",
          delivery: tbl.masterfile.orderfile[0].delivery ? tbl.masterfile.orderfile[0].delivery : "",
          city: tbl.masterfile.orderfile[0].city ? tbl.masterfile.orderfile[0].city : "",
          shipment_status: tbl.masterfile.orderfile[0].shipment_status ? tbl.masterfile.orderfile[0].shipment_status : "",
          consignee: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].consignee : ""

        };
        let s: any = []
        tbl.masterfile.orderfile.map((sts: any) => {
          let status = {
            location_of_the_ship_to_party: sts.location_of_the_ship_to_party,
            shippingtime: sts.shippingtime,
            loading_date: sts.loading_date ? moment(sts.loading_date).format('YYYY/MM/DD') : "",
            shipment_status: sts.shipment_status
          }
          s.push(status);
        })
        console.log("status", s)
        jsn.status_scan = s;
        // {
        //   country_of_origin: tbl.masterfile.orderfile.country_of_origin,
        //   location_of_the_ship_to_party: tbl.masterfile.orderfile.location_of_the_ship_to_party,
        //   forward_agent: tbl.masterfile.orderfile.forward_agent,
        //   forward_agent_name: tbl.masterfile.orderfile.forward_agent_name,
        // }

        this.listData.push(jsn);
        this.old_list.push(jsn);
      })
      console.log("this.listData ==>", this.listData)
    }).catch((err) => {
      console.log(err);
      // alert("Oops! Something went wrong, please try again")
    })
  }

  filterData() {

    let body = {
      "mode": this.mode,
      "delivery": this.delivery,
      "carieer": this.carrier,
      "country_of_origin": this.country_of_origin,
      "consignee": this.location_of_the_ship_to_party,
      "loading_date": this.loading_date,
      "forward_agent_name": this.forwarding_agent_name,
      "total_weight": this.total_weight,
      // "street": "",
      // "postalcode": "",
      "shipment_status": this.shipment_status
    }

    this.listData = [];
    this.old_list = [];
    this.gateway.postMethod(`${environment.baseurl}/api/auth/getdata?pagesize=${this.PageSize}&page=${this.Page}`, body).then((data: any) => {
      // console.log('response ==>', data);
      this.Count = data.results.total;
      this.Data = data.results.data;
      console.log(this.Data, "DATASHIPMENT");
      let index = 0;
      this.Data.map((tbl: any) => {
        console.log(tbl);
        let orderfilelen = tbl.masterfile.orderfile ? tbl.masterfile.orderfile.length : 0;
        let jsn = {
          show: false,
          shipmentDetalsShow: false,
          status_scanShow: false,
          shipmentDetals: [
            {
              country_of_origin: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].country_of_origin : "",
              location_of_the_ship_to_party: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].location_of_the_ship_to_party : "",
              forward_agent: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].forward_agent : "",
              forward_agent_name: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].forward_agent_name : "",
              postalcode: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].postalcode : "",
              street: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].street : "",
              total_weight: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].total_weight : "",
              delivery: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].delivery : "",
              city: (tbl.masterfile.orderfile && tbl.masterfile.orderfile[orderfilelen - 1].city) ? tbl.masterfile.orderfile[orderfilelen - 1].city : "",
              shipment_status: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].shipment_status : "",
              consignee: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].consignee : ""
            }
          ],
          status_scan: [
            // {
            //   location_of_the_ship_to_party: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].location_of_the_ship_to_party : "",
            //   shippingtime: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].shippingtime : "",
            //   loading_date: tbl.masterfile.orderfile != null ? moment(tbl.masterfile.orderfile[0].loading_date).format('YYYY/MM/DD') : "",
            //   // let toDate = moment(new Date(this.events.todate)).format("YYYY-MM-DD");
            //   shipment_status: tbl.masterfile.orderfile != null ? tbl.masterfile.orderfile[0].shipment_status : "",
            // }
          ],
          mode: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].shipping_type : "",
          forward_agent_name: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].forward_agent_name : "",
          country_of_origin: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].country_of_origin : "",
          location_of_the_ship_to_party: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].location_of_the_ship_to_party : "",
          // consignee: tbl.masterfile.orderfile ? tbl.masterfile.orderfile[0].consignee + " " + index++ : "",
          loading_date: tbl.masterfile.orderfile != null ? moment(tbl.masterfile.orderfile[0].loading_date).format('YYYY/MM/DD') : "",
          shippingtime: tbl.masterfile.orderfile[0].shippingtime ? tbl.masterfile.orderfile[0].shippingtime : "",
          delivery: tbl.masterfile.orderfile[0].delivery ? tbl.masterfile.orderfile[0].delivery : "",
          city: tbl.masterfile.orderfile[0].city ? tbl.masterfile.orderfile[0].city : "",
          shipment_status: tbl.masterfile.orderfile[0].shipment_status ? tbl.masterfile.orderfile[0].shipment_status : "",
          consignee: tbl.masterfile.orderfile[0].consignee ? tbl.masterfile.orderfile[0].consignee : ""
        };
        let s: any = []
        tbl.masterfile.orderfile.map((sts: any) => {
          let status = {
            location_of_the_ship_to_party: sts.location_of_the_ship_to_party,
            shippingtime: sts.shippingtime,
            loading_date: sts.loading_date ? moment(sts.loading_date).format('YYYY/MM/DD') : "",
            shipment_status: sts.shipment_status
          }
          s.push(status);
        })
        console.log("status", s)
        jsn.status_scan = s;
        // {
        //   country_of_origin: tbl.masterfile.orderfile.country_of_origin,
        //   location_of_the_ship_to_party: tbl.masterfile.orderfile.location_of_the_ship_to_party,
        //   forward_agent: tbl.masterfile.orderfile.forward_agent,
        //   forward_agent_name: tbl.masterfile.orderfile.forward_agent_name,
        // }

        this.listData.push(jsn);
        this.old_list.push(jsn);
      })
      console.log("this.listData ==>", this.listData)
    }).catch((err) => {
      console.log(err);
      // alert("Oops! Something went wrong, please try again")
    })
  }

  filter() {
    // console.log(this.mode, this.consignee)
    if (this.mode && !this.consignee) {
      this.listData = this.old_list.filter((x) => x.mode === this.mode)
    } else if (this.consignee) {
      this.listData = this.old_list.filter((x) =>
        x.consignee === this.consignee
      )
    }
    console.log(this.listData.filter((x) => { }))
  }

  dummyData() {

    let jsn = {
      show: false,
      shipmentDetalsShow: false,
      status_scanShow: false,
      shipmentDetals: [
        {
          country_of_origin: "Abc",
          location_of_the_ship_to_party: "Abc",
          forward_agent: "Abc",
          forward_agent_name: "Abc"
        }
      ],
      status_scan: [
        {
          location: "Location 1",
          details: "Details 1",
          date: "13 March 2021",
          time: "14:02"
        }
      ],
      mode: "Abc",
      forwarding_agent: "Abc",
      country_of_origin: "Abc",
      location_of_the_ship_to_party: "Abc",
      consignee: "Abc",
      loading_date: "Abc"
    }

    this.listData.push(jsn);
    this.old_list.push(jsn);

    this.listData.push(jsn);
    this.old_list.push(jsn);

    this.listData.push(jsn);
    this.old_list.push(jsn);

  }

  form = new FormGroup({
    website: new FormControl('', Validators.required)
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
  }

  clearFilter(ev: any) {
    console.log(this.websiteList.indexOf(ev) + 1)
  }

  previous() {
    this.page = this.page - 1 < 1 ? 1 : this.page - 1;
    console.log(this.page)
    // this.getData()
  }

  next() {
    this.page = this.page + 1;
    console.log(this.page)
    this.getData();
  }

  // New Pgination code for page change and page size handling .....
  handlePageChange(event: number): void {
    this.Page = event;
    this.getData();
  }

  handlePageSizeChange(event: any): void {
    this.PageSize = event.target.value;
    this.Page = 1;
    this.getData();
  }

  setActiveTutorial(index: number): void {
    this.currentIndex = index;
  }

}
