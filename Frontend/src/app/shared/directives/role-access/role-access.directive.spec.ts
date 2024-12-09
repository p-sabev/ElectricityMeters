import { RoleAccessDirective } from './role-access.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('RoleAccessDirective', () => {
  let directive: RoleAccessDirective;
  let templateRef: jasmine.SpyObj<TemplateRef<any>>;
  let viewContainer: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    templateRef = jasmine.createSpyObj('TemplateRef', ['']);
    viewContainer = jasmine.createSpyObj('ViewContainerRef', ['createEmbeddedView', 'clear']);
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'roles') {
        return JSON.stringify(['Admin', 'Editor']);
      }
      return null;
    });

    directive = new RoleAccessDirective(templateRef, viewContainer);
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  describe('updateView', () => {
    it('should clear the view when permission is false', () => {
      directive.appRoleAccess = false;

      expect(viewContainer.clear).toHaveBeenCalled();
    });

    it('should display the view when permission is true', () => {
      directive.appRoleAccess = true;

      expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    });

    it('should display the view if roles include a matching permission', () => {
      directive.appRoleAccess = 'Admin';

      expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    });

    it('should clear the view if roles do not include a matching permission', () => {
      directive.appRoleAccess = 'Viewer';

      expect(viewContainer.clear).toHaveBeenCalled();
    });

    it('should handle multiple roles and display the view if any match', () => {
      directive.appRoleAccess = 'Viewer, Admin';

      expect(viewContainer.createEmbeddedView).toHaveBeenCalledWith(templateRef);
    });

    it('should clear the view if no roles match for multiple permissions', () => {
      directive.appRoleAccess = 'Viewer, Guest';

      expect(viewContainer.clear).toHaveBeenCalled();
    });
  });

  describe('checkRoles', () => {
    it('should return true if any role matches a single permission', () => {
      directive.appRoleAccess = 'Admin';

      expect(directive['checkRoles']()).toBeTrue();
    });

    it('should return true if any role matches multiple permissions', () => {
      directive.appRoleAccess = 'Viewer, Editor';

      expect(directive['checkRoles']()).toBeTrue();
    });

    it('should return false if no roles match the permission', () => {
      directive.appRoleAccess = 'Guest';

      expect(directive['checkRoles']()).toBeFalse();
    });
  });
});
