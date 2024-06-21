import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appRoleAccess]'
})
export class RoleAccessDirective {
  private roles = JSON.parse(localStorage.getItem('roles') || '[]');
  private permission: string | boolean | undefined;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set appRoleAccess(val: string | boolean | undefined) {
    this.permission = val;
    this.updateView();
  }

  private updateView() {
    if (this.permission === false) {
      this.viewContainer.clear();
    } else if (this.permission === true || (this.roles && this.checkRoles())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkRoles(): boolean {
    console.log(this.permission, this.roles);
    let hasRights = false;
    if (typeof this.permission === 'string') {
      this.permission?.split(', ').forEach((searchedRole) => {
        if (this.roles.includes(searchedRole)) {
          hasRights = true;
        }
      });
    }

    return hasRights;
  }
}
