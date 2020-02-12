import { Component, ViewChild, ElementRef,Inject  } from '@angular/core';
import {CdkDragEnd,CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import   list_picture  from  './data/custom_picture.json';
import  list_picture_mockup  from  './list-picture-mockup.json';
import backgound_room from './data/backgound-room.json';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import * as jspdf from 'jspdf';  


declare var $: any;
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
 
})


export class AppComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'png', // the type you want to download
    elementId: 'room', // the id of html/table element
  }
  @ViewChild('cropend',{static: false}) focusView: ElementRef;
  @ViewChild('contentexport',{static: false}) contentexport: ElementRef;
  title = 'onlypicture';
  public loading = false;
  public listpicture:any = list_picture;
  currentDate = new Date();
  constructor(private _snackBar: MatSnackBar,public dialog: MatDialog,private exportAsService: ExportAsService) {
    
  }
  isshow = false;
  ishide = false;
  checked = false;
  idinputcrop: number;
  value =100;
  style = 'ridge';
  width = '100px';
  height = '100px';
  width1 : '50px';
  height1 : '50px';
  localUrl: any[];
  costspend = '0';
  costspend1 = 0;
  aspectRatio =3/4;
  isexpanded1 = false;
  isexpanded2 = false;
  width_div: string;
  height_div: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImaged: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  isshowcropper = false;
  showCropper = false;
  containWithinAspectRatio = false;
  public coloursEnabled = false;
  PrimaryWhite = '#ffffff';
  SecondaryGrey = '#ccc';
  PrimaryRed = '#dd0031';
  SecondaryBlue = '#006ddd';
  dragPosition = {x: 0, y: 0};
  items = [];
  phone: number;
  fullname:string;
  address:string;
  srcimagezoom ='';
  
  size_multip_picture=[
    {id:1,height: '200px',width: '440px'},
    {id:2,height: '200px',width: '440px'},
    {id:3,height: '200px',width: '440px'},
    {id:4,height: '200px',width: '440px'},
    {id:5,height: '200px',width: '440px'}
  ]
  custom_picture=[];
  
  public background:{url:string}[] = backgound_room;
  public basket:{id:number, name:string,cost:number, width:string, height:string, url:string}[] = list_picture_mockup;
  animal: string;
  name: string;
  backroundnumber = 'assets/image/background.jpg';
  
  choosecustompicture(id){
    for(let n = 0; n<9;n++){
      const num = id-1;
      if(n === num){
        this.custom_picture = this.listpicture[n];
        console.log(this.custom_picture);
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(cropperdialog, {
      width: '1000px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  removeimage(ID){
    for (let i = 0; i< this.custom_picture.length; i++){
      if( i === ID-1){
        this.custom_picture[i].srcimage = '';
        //this.isshowcropper = false;
      }
    }
  }
  showbill() {
    $('#contentexport').modal('show');
    
  }
  zoomimage(number){
    for (let i = 0; i< this.custom_picture.length; i++){
      if( i === number-1){
        this.srcimagezoom = this.custom_picture[i].srcimage
        $('#myModal').modal('show');
      }
    }
  }

  fileChangeEvent(event: any, id): void {
    
    if (event.target.files && event.target.files[0]) {

      if (event.target.files[0].type === 'image/jpeg' || 
          event.target.files[0].type === 'image/png' || 
          event.target.files[0].type ==='image/jpg') {
        if (event.target.files[0].size < 1280 * 536 || event.target.files[0].size < 536 * 1280 ||event.target.files[0].size < 2000000) {
          this._snackBar.open('Hình có kích thước quá nhỏ', 'Lớn hơn 2Mb', {
            duration: 5000,
          });
        }
        else{
          this.imageChangedEvent = event;
          this.idinputcrop = parseInt(event.target.id);
          this.isshowcropper = true;
          for(let i = 0; i<this.custom_picture.length;i++){
            if(id===this.custom_picture[i].id){
              console.log(this.aspectRatio);
              this.aspectRatio = parseFloat(this.custom_picture[i].aspectRatio);
              console.log(this.aspectRatio);
            }
          }
        }
      }
    }
    
    /* alert('ok') */
  }
  cropend(cropend){
    this.croppedImaged = this.croppedImage;
    for (let i = 0; i< this.custom_picture.length; i++){
      if( i === this.idinputcrop-1){
        this.custom_picture[i].srcimage = this.croppedImage;
        this.custom_picture[i].position = "absolute";
        this.custom_picture[i].min_height = "100%"
        this.custom_picture[i].min_width = "100%"
        this.isshowcropper = false;
        $('#Modal').modal('hide');
        

      }
    }
    //console.log(this.croppedImaged);
  }
  imageCropped(event: ImageCroppedEvent) {
    debugger;
    this.croppedImage = event.base64;
    //console.log(event);
    //alert('ok')

  } 
  imageLoaded() {
    $('#Modal').modal('show');
    this.loading = true;

  }
  cropperReady() {
    this.loading = false;
  }
  loadImageFailed() {
      // show message
  }

  Changeborder(e){
    const valueborder = e.value;
    debugger;
    this.style = valueborder;
  }
  Changesize(e){
    const valuesize = e.value;
    if(valuesize === '34' ){
      this.width = '100px';
      this.height = '200px';
    }
    if(valuesize === '68' ){
      this.width = '200px';
      this.height = '100px';
    }
  }
  onSliderChangewidth(e){
    
    this.width = ''+e.value+'px';
  }
  onSliderChangeheight(e){
    
    this.height = ''+e.value+'px';
  }
  chooseroom(e){
    const currentTarget = e.currentTarget;
    const style = currentTarget.style;
    const back = style.backgroundImage;
    this.backroundnumber = back.slice(5, back.length -2);
  }
  processFile(file){
    if (file.target.files && file.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (file: any) => {
          this.localUrl = file.target.result;
          debugger;
      }
      reader.readAsDataURL(file.target.files[0]);
    }
  }
  doubleClick($event,i){
    /* const element = $event.target; */

   
        this.costspend1 = this.costspend1 - $event;
        this.costspend = this.numberWithCommas(this.costspend1);
        this.items =[];
        $('#exampleModal').modal('show');
       
        debugger
     

  }
  openalertinfo($event) {
    const element = $event.target;
    for(let i = 0; i < this.items.length; i++ ){
      if(element.id === this.items[i].name){
        this._snackBar.open(''+this.items[i].name+'', ''+this.items[i].cost+'đ', {
          duration: 5000,
        });
        break;
      }
    }
    
  }
  dragEnd(event: CdkDragDrop<any>) {
    if(event.hasOwnProperty("previousIndex") == true){
      this.costspend1 = 0;
      this.items = [];
      this.width_div = '';
      this.height_div = '';
      const container = event.container;
      const id = container.id;
      const indexstring =id.slice(id.length-1, id.length)
      const index = Number(indexstring);
      this.costspend1 = this.costspend1 + this.basket[index].cost;
      
      this.costspend = this.numberWithCommas(this.costspend1);
      const item = this.basket[index];
      /* const positonx = this.basket[index].width;
      const positony = this.basket[index].height; */
      this.width_div =  this.basket[index].width;
      this.height_div = this.basket[index].height;
      /* this.basket.splice(index, 1); */
      this.items.splice(index, 0,item);
     
      
    }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  addbill(){
    $('#contentexport').modal('hide');
    $('#Modalbill').modal('show');
    var data = document.getElementById('Modalbill');  
   let doc = new jspdf();
   let specialElementHandlers ={
      '#editor': function(element, renderer){
        return true;
      }
   }
    let content = this.contentexport.nativeElement;
    doc.fromHTML(content.innerHTML , 15,15, {
      'width':190,
      'elementHandlers': specialElementHandlers
    });
    doc.save('bill.pdf');
  }
}
@Component({
  selector: 'cropper-dialog',
  templateUrl: 'cropper-dialog.html',
})
export class cropperdialog {

  constructor(
    public dialogRef: MatDialogRef<cropperdialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}