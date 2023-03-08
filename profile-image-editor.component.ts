import { Component, HostListener, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-image-editor',
  templateUrl: './profile-image-editor.component.html',
  styleUrls: ['./profile-image-editor.component.scss']
})
export class ProfileImageEditorComponent {
  positionTop!: number
  positionLeft!: number
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
  ) {}
  ngOnInit() {
    this.positionTop = 0
    this.positionLeft = 0
    this.profileImageScale = 4
    this.backgroundPositionScale = (this.profileImageScale / 10) + 1
    this.editCircleHtmlElement = document.querySelector('#edit-circle') as HTMLElement
    this.profileImageHtmlElement = document.querySelector('#profile-image') as HTMLElement
    this.editIconHtmlElement = document.querySelector('#edit-image-icon') as HTMLElement
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-position-x', `${this.positionLeft}%`)
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-position-y', `${this.positionTop}%`)
  }
  goToProfile = () => {
    console.log('go to prfile')
  }
  editImagePosition = () => {
    this.profileImageEditing = true
    this.renderer.setStyle(this.profileImageHtmlElement, 'width', '80vw')
    this.renderer.setStyle(this.profileImageHtmlElement, 'height', '80%')
    this.renderer.setStyle(this.profileImageHtmlElement, 'position', 'fixed')
    this.renderer.setStyle(this.profileImageHtmlElement, 'top', '50%')
    this.renderer.setStyle(this.profileImageHtmlElement, 'left', '50%')
    this.renderer.setStyle(this.profileImageHtmlElement, 'transform', 'translate(-50%, -50%)')
    this.renderer.setStyle(this.profileImageHtmlElement, 'border-radius', '0')
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-size', '100% auto')
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-position', 'center')
    this.setCirclePosition()
    //circle
    this.renderer.setStyle(this.editCircleHtmlElement, 'height', `calc(${this.profileImageScale * 78}px)`)
    this.renderer.setStyle(this.editCircleHtmlElement, 'width', `calc(${this.profileImageScale * 78}px)`)
  }
  setCirclePosition() {
    this.renderer.setStyle(this.editCircleHtmlElement, 'left', `calc(${this.positionLeft}px)`)
    this.renderer.setStyle(this.editCircleHtmlElement, 'top', `calc(${this.positionTop}px)`)
  }
  saveChanges = (event: Event) => {
    event.stopPropagation()
    this.profileImageEditing = false
    this.renderer.setStyle(this.profileImageHtmlElement, 'width', '50px')
    this.renderer.setStyle(this.profileImageHtmlElement, 'height', '50px')
    this.renderer.setStyle(this.profileImageHtmlElement, 'position', 'relative')
    this.renderer.setStyle(this.profileImageHtmlElement, 'top', '0')
    this.renderer.setStyle(this.profileImageHtmlElement, 'left', '0')
    this.renderer.setStyle(this.profileImageHtmlElement, 'transform', 'translate(0, 0)')
    this.renderer.setStyle(this.profileImageHtmlElement, 'border-radius', '50%')
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-position', `top ${this.positionTop * .135}% left ${this.positionLeft * .135}%`)
    this.renderer.setStyle(this.profileImageHtmlElement, 'background-size', `${this.profileImageScale * 100}%`)
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
  }
  onDrop(event: MouseEvent) {
    this.positionLeft += event.clientX - this.dragStartPosX
    this.positionTop += event.clientY - this.dragStartPosY
    this.setCirclePosition()
  }
}
