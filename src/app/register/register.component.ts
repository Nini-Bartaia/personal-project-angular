import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { brands, cpus, data, positions, teams } from '../shared/form.interface';
import { SharedserviceService } from '../shared/sharedservice.service';
import { HttpClient } from '@angular/common/http';
import { FormArray } from '@angular/forms';
import { Teams } from './teams';
import { Positions } from './positions';
import { observable, Observable, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
 
})
export class RegisterComponent implements OnInit {
  hide=false;
  formArr!: FormGroup;
  mydata: teams[]=[];
  btn:boolean=true;
  position:positions[]=[];
  brands:brands[]=[];
  cpus: cpus[]=[];
  isValid:boolean=false;
  active=0;
  myTeams: Teams[] = [];
  myPos: Positions[]=[];
  selectedTeam: Teams= new Teams(1, "დეველოპერი");
  id=false;
  isshown=false;
  matTabs = [1,2]; 
  selectedFile:File|null=null;
  isNextDisabled=true

  @ViewChild('tabGroup', { static: false })
  tabGroup!: MatTabGroup;
  step:number=2;
  selectedProjectIndex: number = 0;
  isDisabled=true;
  public onMobile=false;
  token='6d8e33bcc7d765da654c61de1d4151af';
  title:string='img';
  base!:any;


  constructor(private service:SharedserviceService,private http:HttpClient, private route:Router) { }
 
  myform=new UntypedFormGroup({});
  secondForm=new UntypedFormGroup({});
  
  ngOnInit(): void {

    this.myTeams= this.service.getTeams();
    console.log(this.myTeams)
    
   

    window.onresize=()=> this.onMobile= window.innerWidth <=390

      this.formArr= new FormGroup({
      name: new FormControl ('',[Validators.required,Validators.minLength(2),Validators.pattern(/^[ა-ჰ]+$/ )]),
      surname: new FormControl ('',[Validators.required,Validators.minLength(2),Validators.pattern(/^[ა-ჰ]+$/)]),
      team_id: new FormControl(null,Validators.required),
      position_id: new FormControl(null,Validators.required),
      email: new FormControl('',[Validators.required,Validators.pattern(/^[^@]+@(gmail)\.com$/i)]),
      phone_number: new FormControl(null,[Validators.required,Validators.pattern(/^(\+995[0-9]{9})$/)]),
      laptop_name:new FormControl('',[Validators.required,Validators.pattern(/^[A-Za-z0-9\s!@#$%^&*()_+=-`~\\\]\[{}|';:/.,?><]*$/)]),
      laptop_brand_id:new FormControl('',Validators.required),
      laptop_cpu:new FormControl('',Validators.required),
      laptop_cpu_cores: new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]*$/)]),
      laptop_cpu_threads:new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]*$/)]),
      laptop_ram:new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]*$/)]),
      laptop_hard_drive_type:new FormControl(null,Validators.required),
      laptop_state:new FormControl('',Validators.required),
      laptop_purchase_date:new FormControl(''),
      laptop_price:new FormControl('',[Validators.required,Validators.pattern(/^[0-9]*$/)]),
      token: new FormControl(this.token,Validators.required),
      
      
  
  }, { updateOn: 'blur' })

  
    this.formArr.valueChanges.subscribe((v) => {
      this.isNextDisabled = !this.formArr.valid;
 });


    this.service.getData().subscribe((data)=>{
      console.log(data)
      this.mydata=data;
    }, (err)=>{
      console.error('error caught in component')
    })

    this.service.getPositions().subscribe((value)=>{
      console.log(value)
      this.position=value;
      
    },(err)=>{
      console.error('error caught in component')
    })

    this.service.getBrands().subscribe((value)=>{
      console.log(value)
      this.brands=value;
      
    },(err)=>{
      console.error('error caught in component')
    })
    this.service.getCpu().subscribe((value)=>{
      console.log(value)
      this.cpus=value;
      
    },(err)=>{
      console.error('error caught in component')
    })

   

  }

 
  url=''

 

  public changeImage(e:any){
    if(e.target.files){
      let reader= new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload=(event:any)=>{
          this.url=event.target.result;
           
      }
     
    }
    
  }

  public getphoto(){
    this.isshown=!this.isshown
  }


 
  public selectList(e:any){
    this.formArr.get('team_id')?.setValue(e.target.value)
    console.log(e.target.value)

    return e.target.value && this.hide==true
  }
  public selectList2(e:any){
    this.formArr.get('position_id')?.setValue(e.target.value)
   console.log(e.target.value)

   return e.target.value
 }
 public selectList3(e:any){
  
  this.formArr.get('laptop_brand_id')?.setValue(e.target.value)
 console.log(e.target.value)

 return e.target.value
}
public selectList4(e:any){

 this.formArr.get('laptop_cpu')?.setValue(e.target.value)
 console.log(e.target.value)

 return e.target.value
}

public getFile(event:any){
  this.selectedFile=<File>event.target.files[0];
  console.log(this.selectedFile);
  console.log(this.url)
  const filedata :FormData= new FormData();
  filedata.append('laptop_image',this.selectedFile!,this.selectedFile!.name);
  console.log(filedata)
  console.log(typeof(filedata))
  return this.isshown && this.http.post(this.service.myurl,filedata).subscribe(res=>{
    console.log(res)
  },(err)=>{
    console.error('error caught in component')
  })
 
}


upload(filedata: FormData){
  this.http.post(this.service.postApi+ '/users',filedata).subscribe(res=>{
        console.log(res)
      },(err)=>{
        console.error('error caught in component')
      })
}


  get listError(){
    return (
  
      this.formArr.get('team_id')?.markAllAsTouched ||
      this.myform.get('team_id')?.touched
      )
    }
     get brand(){
      
       if(this.formArr.get('secondForm.laptopBrandId')){
       console.log(  this.formArr.get('secondForm.laptopBrandId'))
       return this.id=true
      
       }
       return  this.id=false;
      
      
    }

    get Cpu(){
      if(this.formArr.get('secondForm.laptopCpu')){
        console.log(this.formArr.get('secondForm.laptopCpu'))
        return this.id=true;
      }
      return this.id=false;
    }
     
      
      //this.myform.get('teamId')?.errors
    
  // public onSubmit() {
  //   for (let controller in this.myform.controls) {
  //     this.myform.get(controller)?.markAsTouched()
  //   }

  //   if(this.myform.valid) {
  //     console.log('Ok')
  //   } else {
  //     console.log('No')
  //   }
  // }

  get f() {
    return this.myform.controls;
  }
  onSubmit() {
    this.isValid = true;
    // stop here if form is invalid
    if (this.myform.invalid) {
      return;
    }
    console.log(this.myform.value);
  }

   
  
logChange(event:any){
  console.log(event)
  return event;
  
}
buttonClick() {
  if(this.myform.invalid && this.myform.untouched){

  this.tabGroup._tabs.toArray()[1].disabled = true;
  } else{
    this.tabGroup._tabs.toArray()[1].disabled = false;
  }
  //  or
 // this.tabGroup._tabs['_results'][1].disabled = true;
}


moveToSelectedTab(tabName: string) {
  console.log(this.formArr)
      if(this.formArr.get('name')?.valid  &&this.formArr.get('surname')?.valid && this.formArr.get('email')?.valid && this.formArr.get('team_id')?.valid &&this.formArr.get('position_id')?.valid && this.formArr.get('phone_number')?.valid){
        console.log(this.formArr.get('myform'))
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[1]).innerText == tabName) {
        console.log((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[1]).innerText);
        
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[1]).click();
        //console.log( (<HTMLElement>document.querySelectorAll('.mat-tab-label')[1]).click());
        //  this.isDisabled=false;
        //  console.log(this.isDisabled)
       // console.log(this.tabGroup._tabs.toArray()[1])
          return this.tabGroup._tabs.toArray()[1].isActive = true; 
        }
    }
    return this.tabGroup._tabs.toArray()[1].isActive = false;
     
}



moveToSelectedTab2(tabName: string) {
 
  if(this.myform.valid ){
   // console.log(this.myform.valid)
  if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[0]).innerText == tabName) {
    console.log((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[0]).innerText);
    (<HTMLElement>document.querySelectorAll('.mat-tab-label')[0]).click();
      return this.tabGroup._tabs.toArray()[0].isActive = true && this.tabGroup._tabs.toArray()[1].disabled==false;

  }
}
return this.tabGroup._tabs.toArray()[0].isActive = false && this.tabGroup._tabs.toArray()[1].disabled==true;
 
}

showData(){
  if(this.formArr.get('myform')?.touched){
    console.log(this.formArr)
  }
}

changeProjectTab() {
  this.selectedProjectIndex = 0;
}


validateForm(formArr:FormGroup){
  Object.keys(formArr.controls).forEach(field=>{
    console.log(field);
    const control=formArr.get(field);
    if(control instanceof FormControl){
      control.markAsTouched({onlySelf:true});
       this.btn=false;
    }else if(control instanceof FormGroup){
      this.validateForm(control);
       this.btn=true;
      
    }
  })

}

formSubmit(){
  console.log(this.formArr);
  if(this.formArr.valid){
    console.log('ok')
  }else{
    this.validateForm(this.formArr)
  }
}

postData(){
  this.service.post(this.formArr.value as data).subscribe(data=>console.log(data));
  this.route.navigate(['/success'])
  
}

OnSelect(teamId: any){
  console.log(teamId.target.value);
  this.myPos=this.service.getPos().filter((item)=> item.teamsId==teamId.target.value) 
  console.log(this.myPos)
}


}
