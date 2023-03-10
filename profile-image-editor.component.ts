import { Component, HostListener, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-image-editor',
  templateUrl: './profile-image-editor.component.html',
  styleUrls: ['./profile-image-editor.component.scss']
})
export class ProfileImageEditorComponent {
  positionTop!: number | undefined
  positionLeft!: number | undefined
  profileImageScale!: number
  backgroundPositionScale!: number
  isOnProfileSite: boolean = true
  profileImageEditing: boolean = false
  profileImageHtmlElement!: HTMLElement
  editIconHtmlElement!: HTMLElement
  editCircleHtmlElement!: HTMLElement
  dragStartPosX!: number
  dragStartPosY!: number
  constructor(
    private renderer: Renderer2
  ) {
    this.getProfileImagePositionFromServer()
  }
  ngOnInit() {
    if(this.positionLeft === undefined || this.positionTop === undefined) {
      this.positionTop = (((window.innerWidth * 0.8) / 1.6) / 2)
      this.positionLeft = ((window.innerWidth * 0.8) / 2)
      console.log('position undefined')
    }
    this.profileImageScale = 4
    this.backgroundPositionScale = (this.profileImageScale / 10) + 1
    this.editCircleHtmlElement = document.querySelector('#edit-circle') as HTMLElement
    this.profileImageHtmlElement = document.querySelector('#profile-image') as HTMLElement
    this.editIconHtmlElement = document.querySelector('#edit-image-icon') as HTMLElement
    this.renderer.setStyle(this.profileImageHtmlElement, 
      'background-position-x', `${this.positionLeft}%`)
    this.renderer.setStyle(this.profileImageHtmlElement, 
      'background-position-y', `${this.positionTop}%`)
  }
  goToProfile = () => {
    console.log('go to prfile')
  }
  getProfileImagePositionFromServer = () => {
    // this.positionTop = (((window.innerWidth * 0.8) / 1.6) / 2)
    // this.positionLeft = ((window.innerWidth * 0.8) / 2)

    this.positionTop = 180
    this.positionLeft = 370

    // this.positionTop = undefined
    // this.positionLeft = undefined
  }
  editImagePosition = () => {
    this.profileImageEditing = true
    this.isOnProfileSite = false
    this.renderer.setStyle(this.profileImageHtmlElement, 'transition', 'width 1s, height 1s, border-radius 0s, transform .25s')
    this.renderer.setStyle(this.profileImageHtmlElement, 'width', '80vw')
    this.renderer.setStyle(this.profileImageHtmlElement, 'height', `calc(80vw / 1.6)`)
    
    this.renderer.setStyle(this.profileImageHtmlElement, 'position', 'fixed')
    this.renderer.setStyle(this.profileImageHtmlElement, 'top', '50%')
    this.renderer.setStyle(this.profileImageHtmlElement, 'left', '50%')
    this.renderer.setStyle(this.profileImageHtmlElement, 'transform', 'translate(-50%, -50%)')
    this.renderer.setStyle(this.profileImageHtmlElement, 'border-radius', '0')
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-size', '100% auto')
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-position', 'center')
    //circle
    this.renderer.setStyle(this.editCircleHtmlElement, 
      'height', `calc(${this.profileImageScale * 80}px)`)
    this.renderer.setStyle(this.editCircleHtmlElement, 
      'width', `calc(${this.profileImageScale * 80}px)`)
    this.setCirclePosition()
  }
  setCirclePosition() {
    this.renderer.setStyle(this.editCircleHtmlElement, 'left', `${this.calculatePositionLeftInPercent(this.positionLeft!)}`)
    this.renderer.setStyle(this.editCircleHtmlElement, 'top', `${this.calculatePositionTopInPercent(this.positionTop!)}`)
    this.renderer.setStyle(this.editCircleHtmlElement, 'transform', `translate(-50%, -50%)`)
  }
  calculatePositionLeftInPercent = (positionLeft: number): string => {
    return (positionLeft * 100) / (window.innerWidth * 0.8) + '%'
  }
  calculatePositionTopInPercent = (positionTop: number): string => {
    return (positionTop * 100) / ((window.innerWidth * 0.8) / 1.6) + '%'
  }
  setCirclePositionOnClick = (event: MouseEvent) => {
    const offsetLeft = (window.innerWidth - this.profileImageHtmlElement.offsetWidth) / 2
    const offsetTop = (window.innerHeight - this.profileImageHtmlElement.offsetHeight) / 2
    this.positionLeft = event.clientX - offsetLeft
    this.positionTop = event.clientY - offsetTop
    this.renderer.setStyle(this.editCircleHtmlElement, 'left', `${event.clientX - offsetLeft}px`)
    this.renderer.setStyle(this.editCircleHtmlElement, 'top', `${event.clientY - offsetTop}px`)
    this.renderer.setStyle(this.editCircleHtmlElement, 'transform', `translate(-50%, -50%)`)
  }
  saveChanges = (event: Event) => {
    event.stopPropagation()
    this.profileImageEditing = false
    this.isOnProfileSite = true

    this.renderer.addClass(this.profileImageHtmlElement, 'profile-image:hover')
    this.renderer.setStyle(this.profileImageHtmlElement, 'transition', 'none')
    this.renderer.setStyle(this.profileImageHtmlElement, 'width', '50px')
    this.renderer.setStyle(this.profileImageHtmlElement, 'height', '50px')
    this.renderer.setStyle(this.profileImageHtmlElement, 'position', 'relative')
    this.renderer.setStyle(this.profileImageHtmlElement, 'top', '0')
    this.renderer.setStyle(this.profileImageHtmlElement, 'left', '0')
    this.renderer.setStyle(this.profileImageHtmlElement, 'transform', 'translate(0, 0)')
    this.renderer.setStyle(this.profileImageHtmlElement, 'border-radius', '50%')
    this.renderer.setStyle(this.profileImageHtmlElement, 
      'background-position', `
      top ${this.calculatePositionTopInPercent(this.positionTop!)}
      left ${this.calculatePositionLeftInPercent(this.positionLeft!)}
      `)
    this.renderer.setStyle(this.profileImageHtmlElement, 
      'background-size', `${this.profileImageScale * 100}%`)
  }
  onMouseOver = (event: MouseEvent) => {
    if(this.profileImageEditing) {
      this.renderer.addClass(this.profileImageHtmlElement, 'profile-image:hover')
    } else {
      this.renderer.removeClass(this.profileImageHtmlElement, 'profile-image:hover')
    }
  }
  onMouseOut = (event: MouseEvent) => {
    this.renderer.removeClass(this.profileImageHtmlElement, 'profile-image:hover')
    event.stopPropagation()
  }
  allowDrop(event: MouseEvent) {
    event.preventDefault()
  }
  onDragStart(event: MouseEvent) {
    this.dragStartPosX = event.clientX
    this.dragStartPosY = event.clientY
    event.stopPropagation()
  }
  onDrop(event: MouseEvent) {
    this.setCirclePositionOnClick(event)
    this.setCirclePosition()
  }
}
