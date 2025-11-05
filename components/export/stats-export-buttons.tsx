'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileText, Loader2, Sheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TeamStats } from '@/lib/utils/stats';
import { exportStatsCSV, exportStatsJSON, exportStatsPDF } from '@/lib/utils/export';

interface StatsExportButtonsProps {
  stats: TeamStats[];
}

export function StatsExportButtons({ stats }: StatsExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      exportStatsCSV(stats);
      toast({
        title: 'CSV exporté',
        description: `Statistiques de ${stats.length} équipes exportées`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter en CSV",
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    setIsExporting(true);
    try {
      exportStatsJSON(stats);
      toast({
        title: 'JSON exporté',
        description: `Données de ${stats.length} équipes téléchargées`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter en JSON",
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportStatsPDF(stats);
      toast({
        title: 'PDF généré',
        description: `Statistiques de ${stats.length} équipes téléchargées`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: 'Impossible de générer le PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isExporting || stats.length === 0}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Format d'export</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
          <Sheet className="mr-2 h-4 w-4" />
          <span>CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
          <FileJson className="mr-2 h-4 w-4" />
          <span>JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
