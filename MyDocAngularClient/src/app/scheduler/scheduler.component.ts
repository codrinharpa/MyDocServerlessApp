import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { duration, isMoment, Moment } from 'moment';
import { AppointmentService } from '../service/appointment.service';
var moment = require('moment');
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  public doctorEmail:string;
  public appointment:any;
  public appointmentDetails:any;
  public updateAppointment:any;
  public successMessage:string;
  public deleteAppointmentSuccessMessage:string;
  public errorMessage:string;
  public createAppointmentVisible:boolean = false;
  public appointmentDetailsVisible:boolean = false;
  public updateAppointmentVisible:boolean = false;
  public events;
  public appointments;
  constructor(public appointmentService:AppointmentService) {
    this.appointment = {};
    this.appointmentDetails = {};
    this.doctorEmail = localStorage.getItem('doctorEmail');
    this.appointment.doctorEmail = this.doctorEmail;
  }
  ngOnInit() {
     this.calendarOptions = {
        slotDuration: duration("00:15:00"),
        minTime: duration("08:00:00"),
        maxTime: duration("18:15:00"),
        height: 'auto',
        buttonText: {
          today:    'astazi',
          month:    'luna',
          week:     'saptamana',
          day:      'zi',
        },
        locale: 'ro',
        weekends: false,
        editable: true,
        selectOverlap: false,
        selectable: true,
        eventLimit: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        events: []
      };
      this.loadEvents();
  }
  clearEvents() {
    this.events = [];
  }
  convertTimestamp(timestamp,time){
    let splitted = timestamp.split('-');
    splitted.splice(3,2);
    let date = splitted.join('-');
    return (date + 'T' + time);
  }
  loadEvents() {
    let doctorEmail = localStorage.getItem('doctorEmail');
    this.appointmentService.getAppointmentsInRange(doctorEmail,"2015-01-01","2020-01-01").subscribe( (data:any) => {
      let events = [];
      this.appointments = data.appointments;
      for (let i = 0 ; i < this.appointments.length; i++){
        let eventAppointment = this.appointments[i];
        eventAppointment.start = this.convertTimestamp(this.appointments[i].timestamp,this.appointments[i].appointmentStart);
        eventAppointment.end = this.convertTimestamp(this.appointments[i].timestamp,this.appointments[i].appointmentEnd);
        eventAppointment.title = this.appointments[i].pacientSurname + " " + this.appointments[i].pacientFirstname;
        events.push(eventAppointment);
      }
      this.events = events;
      console.log(this.events);
    });
  }

  onSelect(event){
    if (event.detail.view.type == 'month') {
      return;
    }
    this.createAppointmentVisible = true;
    this.appointment.appointmentDate = event.detail.start.format('YYYY-MM-DD');
    this.appointment.appointmentStart = event.detail.start.format("HH:mm");
    this.appointment.appointmentEnd = event.detail.end.format("HH:mm");
  }
  onDayClick(event){
    if (event.detail.view.type == 'month') {
      let date = event.detail.date.format('YYYY-MM-DD');
      this.ucCalendar.fullCalendar('changeView', 'agendaDay',event.detail.date);
      this.ucCalendar.fullCalendar('gotoDate',event.detail.date);
    }
  }
  onEventClick(event){
    console.log(event);
    this.appointmentDetailsVisible = true;
    this.appointmentDetails = {
      title: event.detail.event.title,
      timestamp: event.detail.event.timestamp,
      appointmentDate: event.detail.event.appointmentDate,
      appointmentStart: event.detail.event.appointmentStart,
      appointmentEnd: event.detail.event.appointmentEnd,
      pacientPhone: event.detail.event.pacientPhone,
      details: event.detail.event.details,
    } 
  }
  onCreateAppointment(){
    console.log(this.appointment);
    this.appointment.doctorEmail = localStorage.getItem('doctorEmail');
    this.appointmentService.createAppointment(this.appointment).subscribe( (data:any) =>{
      if(data.message == 'Created'){
          this.successMessage = "Programarea a fost creeat cu succes";
          this.loadEvents();
      }
      else{
          this.errorMessage = "Eroare. Verificati campurile";
      }
    },(err:any)=>{
        console.log(err);
        this.errorMessage = "Eroare. Verificati campurile";
    });
  }
  onDeleteAppointment(){
    this.appointmentService.deleteAppointment({
      doctorEmail: localStorage.getItem('doctorEmail'),
      pacientPhone: this.appointmentDetails.pacientPhone,
      timestamp: this.appointmentDetails.timestamp
    }).subscribe( (data:any) => {
      if(data.message == 'Deleted'){
        this.deleteAppointmentSuccessMessage = "Programarea a fost anulata cu succes";
        this.loadEvents();
        this.appointmentDetailsVisible = false;
      }
    });
  }
  onCancelAppointment(){
    this.createAppointmentVisible = false;
  }
  onCancelAppointmentDetails(){
    this.appointmentDetailsVisible = false;
  }
  onCancelUpdateAppointment(){
    this.updateAppointmentVisible = false;
    this.loadEvents();
  }
  onEventDrop(event){
    console.log(event);
    let view = this.ucCalendar.fullCalendar('getView');
    console.log(view.name);
    if (view.name !== 'month') {
      console.log('da');
      this.updateAppointment = {
        timestamp: event.detail.event.timestamp,
        doctorEmail: localStorage.getItem('doctorEmail'),
        pacientPhone: event.detail.event.pacientPhone,
        newAppointmentDate: event.detail.event.start.format('YYYY-MM-DD'),
        newAppointmentStart: event.detail.event.start.format("HH:mm"),
        newAppointmentEnd: event.detail.event.end.format("HH:mm"),
      }
      this.updateAppointmentVisible = true;
    } else {
      this.updateAppointment = {
        timestamp: event.detail.event.timestamp,
        doctorEmail: localStorage.getItem('doctorEmail'),
        pacientPhone: event.detail.event.pacientPhone,
        newAppointmentDate: event.detail.event.start.format('YYYY-MM-DD'),
      }
      this.updateAppointmentVisible = true;
    }
  }

  onUpdateAppointment(){
    this.appointmentService.updateAppointment(this.updateAppointment).subscribe( (data:any) => {
      console.log(data);
      this.loadEvents();
      this.updateAppointmentVisible = false;
    });
  }
}
