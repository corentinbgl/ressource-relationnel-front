import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceDetailsComponent } from './resource-details.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RessourceService } from '../../service/ressource.service';
import { CommentaireService } from '../../service/commentaire.service';
import { AuthService } from '../../service/auth.service';
import { ProgressionService } from '../../service/progression.service';

describe('ResourceDetailsComponent', () => {
  let component: ResourceDetailsComponent;
  let fixture: ComponentFixture<ResourceDetailsComponent>;

  const mockRessources = [{ id: 42, titre: 'Test ressource' }];
  const mockCommentaires = [
    { id: 1, ressourceId: 42, auteur: 'user@mail.com', contenu: 'Comment 1', date: new Date() },
    { id: 2, ressourceId: 42, auteur: 'user@mail.com', contenu: 'Reply to 1', date: new Date(), reponseA: 1 }
  ];

  const mockRessourceService = {
    getAll: jasmine.createSpy().and.returnValue(of(mockRessources))
  };

  const mockCommentaireService = {
    getByRessource: jasmine.createSpy().and.returnValue(of(mockCommentaires)),
    addCommentaire: jasmine.createSpy().and.callFake((commentaire) =>
      of({ ...commentaire, id: 3, date: new Date() })
    )
  };

  const mockAuthService = {
    currentUser$: of({ email: 'user@mail.com' })
  };

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: () => '42'
      }
    }
  };

  const mockProgressionService = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: RessourceService, useValue: mockRessourceService },
        { provide: CommentaireService, useValue: mockCommentaireService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProgressionService, useValue: mockProgressionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });


  it('should add a reply to a comment', () => {
    component.replyingToId = 1;
    component.replyContent = 'New reply';
    component.sendReply();

    expect(component.reponsesParCommentaire[1]).toBeDefined();
    expect(component.reponsesParCommentaire[1].some(c => c.contenu === 'New reply')).toBeTrue();
  });

  it('should delete a comment and its replies', () => {
    component.deleteCommentaire(1);
    expect(component.commentaires.some(c => c.id === 1)).toBeFalse();
    expect(component.commentaires.some(c => c.reponseA === 1)).toBeFalse();
  });

  it('should toggle favori/exploitée/miseDeCote', () => {
    component.toggleFavori();
    expect(component.isFavori).toBeTrue();

    component.toggleExploitee();
    expect(component.isExploitee).toBeTrue();

    component.toggleMiseDeCote();
    expect(component.isMiseDeCote).toBeTrue();
  });
});
