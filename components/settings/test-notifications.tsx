'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export function TestNotifications() {
  const { toast } = useToast();

  const sendTestNotification = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Non supporté',
        description: 'Votre navigateur ne supporte pas les notifications',
        variant: 'destructive',
      });
      return;
    }

    if (Notification.permission !== 'granted') {
      toast({
        title: 'Permission refusée',
        description: 'Veuillez activer les notifications dans les paramètres',
        variant: 'destructive',
      });
      return;
    }

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification('🏀 Match en cours', {
          body: 'Lakers vs Warriors - 98-95 (Q4 2:30)',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'test-notification',
          data: {
            url: '/live',
            matchId: 'test-123',
          },
          actions: [
            {
              action: 'view',
              title: 'Voir le match',
            },
            {
              action: 'close',
              title: 'Fermer',
            },
          ],
        } as NotificationOptions);

        toast({
          title: 'Notification envoyée',
          description: 'Vérifiez votre centre de notifications',
        });
      } else {
        toast({
          title: 'Service Worker non prêt',
          description: 'Rechargez la page et réessayez',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'envoyer la notification",
        variant: 'destructive',
      });
    }
  };

  const sendMatchStartNotification = async () => {
    if (Notification.permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification('🔔 Match à venir', {
        body: 'Lakers vs Warriors commence dans 15 minutes',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'match-start',
        data: {
          url: '/live',
          type: 'match-start',
        },
      } as NotificationOptions);

      toast({
        title: 'Notification envoyée',
        description: 'Notification de début de match',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendScoreUpdateNotification = async () => {
    if (Notification.permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification('⚡ Score mis à jour', {
        body: 'Lakers 105 - 102 Warriors (FINAL)',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'score-update',
        requireInteraction: true,
        data: {
          url: '/schedule',
          type: 'score-update',
        },
      } as NotificationOptions);

      toast({
        title: 'Notification envoyée',
        description: 'Notification de score final',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Tester les Notifications
        </CardTitle>
        <CardDescription>
          Envoyez des notifications de test pour vérifier que tout fonctionne
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button onClick={sendTestNotification} variant="outline" className="justify-start">
            🏀 Match en cours (avec actions)
          </Button>

          <Button onClick={sendMatchStartNotification} variant="outline" className="justify-start">
            🔔 Début de match (15 min avant)
          </Button>

          <Button onClick={sendScoreUpdateNotification} variant="outline" className="justify-start">
            ⚡ Score final (interaction requise)
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Types de notifications :</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Match en cours : avec boutons d'action</li>
            <li>Début de match : notification simple avec vibration</li>
            <li>Score final : nécessite une interaction utilisateur</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
