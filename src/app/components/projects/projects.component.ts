import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProjectsService, Project } from '../../services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'score', 'durationInDays', 'bugsCount', 'madeDadeline'];
  dataSource = new MatTableDataSource<Project>([]);
  
  @ViewChild(MatSort) sort!: MatSort;

  avgScore = 0;
  percentDeadlineMet = 0;

  filterValue = '';


  constructor(private projectsService: ProjectsService) {}

 ngOnInit() {
  // filter function for the table
  this.dataSource.filterPredicate = (project: Project, filterText: string): boolean => {
    // clean up the filter text
    const search = filterText.trim().toLowerCase();

    // if the filter is empty, always show the row
    if (!search) {
      return true;
    }

    // check if the project name matches
    const matchName = project.name.toLowerCase().includes(search);

    // check if the score matches
    const matchScore = project.score.toString().includes(search);

    // check if duration matches
    const matchDuration = project.durationInDays.toString().includes(search);

    // check if bugs count matches
    const matchBugs = project.bugsCount.toString().includes(search);

    // check if "madeDaedline" (boolean) matches "yes"/"no"
    const deadlineAsText = project.madeDadeline ? 'yes' : 'no';

    const matchDeadline = deadlineAsText.includes(search);

    // Return true if any of these conditions are true
    return matchName || matchScore || matchDuration || matchBugs || matchDeadline;
  };
}


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.recalculateStats();
      },
      error: (err) => console.error('Projects load error:', err)
    });
  }

  applyFilter(value: string) {
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
    this.recalculateStats();
  }

  recalculateStats() {
    const rows = this.dataSource.filteredData.length ? this.dataSource.filteredData : this.dataSource.data;

    if (!rows.length) {
      this.avgScore = 0;
      this.percentDeadlineMet = 0;
      return;
    }

    const sum = rows.reduce((acc, r) => acc + (Number(r.score) || 0), 0); // useing reduce for sum the score
    this.avgScore = Math.round((sum / rows.length) * 10) / 10; // using math round to get the avg score

    const met = rows.filter(r => !!r.madeDadeline).length;
    this.percentDeadlineMet = Math.round((met / rows.length) * 100);
  }

  rowClass(row: Project) {// help me to color to red and green when needed - getting ng class for each case
    if (row.score < 70) return 'row--low';
    if (row.score > 90) return 'row--high';
    return '';
  }
}
