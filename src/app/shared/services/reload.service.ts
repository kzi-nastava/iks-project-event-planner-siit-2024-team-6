import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private reloadSource = new Subject<{ id: string }>();

  emitReload(id: string): void {
    this.reloadSource.next({ id });
  }

  onReload(id: string): Observable<void> {
    return this.reloadSource.asObservable().pipe(
      filter((event) => event.id === id),
      map(() => void 0) // Map the result to void
    );
  }
}
