import { Component, OnInit } from '@angular/core';
import { ChordDiagramService } from '../chord-diagram.service';

@Component({
  selector: 'app-chord',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.css']
})
export class ChordComponent implements OnInit {

  constructor(private chordDiagramService : ChordDiagramService) { }

  ngOnInit(): void {
  }

}
