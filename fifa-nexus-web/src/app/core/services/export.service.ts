import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NexusDataService, Match, Team, Player } from './nexus-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private dataService: NexusDataService) { }

  exportPDF(title: string, dataObj: any) {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 191, 255); // #00BFFF
    doc.text(`FIFA Nexus - ${title}`, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    let startY = 40;

    if (dataObj.type === 'AI_REPORT') {
      doc.setFontSize(12);
      doc.setTextColor(50);
      const splitText = doc.splitTextToSize(dataObj.content, 180);
      doc.text(splitText, 14, startY);
    } 
    else if (dataObj.type === 'MATCH_STATS') {
      autoTable(doc, {
        startY: startY,
        head: [['Metric', 'Home Team', 'Away Team']],
        body: [
          ['Score', dataObj.homeScore, dataObj.awayScore],
          ['Possession', '55%', '45%'],
          ['Shots on Target', '6', '4']
        ],
        theme: 'grid',
        styles: { fillColor: [5, 8, 22], textColor: 255 },
        headStyles: { fillColor: [0, 191, 255] }
      });
    }
    else if (dataObj.type === 'TEAMS') {
       const teams = this.dataService.getTeams();
       const body = teams.map(t => [t.name, t.played, t.won, t.drawn, t.lost, t.gd, t.points]);
       autoTable(doc, {
         startY: startY,
         head: [['Team', 'MP', 'W', 'D', 'L', 'GD', 'PTS']],
         body: body,
         theme: 'grid',
         styles: { fillColor: [5, 8, 22], textColor: 255 },
         headStyles: { fillColor: [0, 191, 255] }
       });
    }

    doc.save(`fifa-nexus-${title.toLowerCase().replace(/\\s+/g, '-')}.pdf`);
  }

  exportCSV(filename: string, data: any[]) {
    if (!data || !data.length) return;
    
    const separator = ',';
    const keys = Object.keys(data[0]);
    
    const csvContent =
      keys.join(separator) +
      '\\n' +
      data.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
