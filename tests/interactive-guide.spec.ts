import { test, expect } from '@playwright/test';

// Pages avec leurs data-guide attendus
const pagesWithGuides = [
  {
    path: '/conversations',
    guides: [
      'conv-kpi-total',
      'conv-kpi-avgtime',
      'conv-kpi-tokens',
      'conv-kpi-languages',
      'conv-search',
      'conv-filter-all',
      'conv-filter-fr',
      'conv-filter-en',
      'conv-filter-es',
      'conv-filter-jp',
      'conv-conversations-list',
    ],
  },
  {
    path: '/newsletters',
    guides: [
      'news-kpi-sent',
      'news-kpi-perso',
      'news-kpi-openrate',
      'news-kpi-segments',
      'news-filters',
      'news-newsletters-list',
    ],
  },
  {
    path: '/reviews',
    guides: [
      'reviews-kpi-avgrating',
      'reviews-kpi-pending',
      'reviews-kpi-positive',
      'reviews-kpi-total',
      'reviews-filter-all',
      'reviews-filter-pending',
      'reviews-filter-approved',
      'reviews-filter-published',
      'reviews-filter-rejected',
      'reviews-reviews-list',
    ],
  },
  {
    path: '/competitors',
    guides: [
      'competitors-kpi-urgent',
      'competitors-kpi-cheaper',
      'competitors-kpi-avgdiff',
      'competitors-kpi-monitored',
      'competitors-filter-all',
      'competitors-filter-urgent',
      'competitors-filter-high',
      'competitors-filter-medium',
      'competitors-filter-low',
      'competitors-alerts-list',
    ],
  },
  {
    path: '/social',
    guides: [
      'social-kpi-reach',
      'social-kpi-sentiment',
      'social-kpi-pending',
      'social-kpi-negative',
      'social-filters',
      'social-mentions-list',
    ],
  },
  {
    path: '/roi',
    guides: [
      'roi-kpi-revenue',
      'roi-kpi-bookings',
      'roi-kpi-alerts',
      'roi-kpi-growth',
      'roi-filter-all',
      'roi-filter-critical',
      'roi-filter-warning',
      'roi-filter-growth',
      'roi-filter-stable',
      'roi-alerts-list',
    ],
  },
  {
    path: '/flights',
    guides: [
      'flights-kpi-affected',
      'flights-kpi-notified',
      'flights-kpi-delayed',
      'flights-kpi-cancelled',
      'flights-filter-all',
      'flights-filter-delay',
      'flights-filter-cancelled',
      'flights-filter-gate',
      'flights-alerts-list',
    ],
  },
  {
    path: '/reports',
    guides: [
      'reports-custom-section',
      'reports-filter-all',
      'reports-filter-performance',
      'reports-filter-content',
      'reports-filter-revenue',
      'reports-filter-operations',
      'reports-templates-list',
    ],
  },
  {
    path: '/content',
    guides: [
      'content-kpi-published',
      'content-kpi-seo',
      'content-kpi-words',
      'content-kpi-images',
      'content-filters',
      'content-articles-list',
    ],
  },
  {
    path: '/concierge-pro',
    guides: [
      'concierge-kpi-active',
      'concierge-kpi-resolved',
      'concierge-kpi-withbooking',
      'concierge-kpi-languages',
      'concierge-conversations-list',
      'concierge-chat-panel',
      'concierge-input',
      'concierge-btn-send',
    ],
  },
  {
    path: '/staff-assistant',
    guides: [
      'staff-kpi-questions',
      'staff-kpi-helpful',
      'staff-kpi-procedures',
      'staff-kpi-responsetime',
      'staff-question-section',
      'staff-question-input',
      'staff-btn-ask',
      'staff-quicklink-procedures',
      'staff-quicklink-operations',
      'staff-quicklink-hr',
      'staff-filter-all',
      'staff-filter-procedures',
      'staff-filter-hr',
      'staff-filter-technical',
      'staff-filter-operations',
      'staff-search',
      'staff-history-list',
      'staff-knowledge-section',
      'staff-kb-manual',
      'staff-kb-faq',
      'staff-kb-tech',
      'staff-kb-regulations',
    ],
  },
  {
    path: '/visual-factory',
    guides: [
      'visual-kpi-total',
      'visual-kpi-ready',
      'visual-kpi-approved',
      'visual-kpi-generating',
      'visual-generator-section',
      'visual-type-selector',
      'visual-prompt-input',
      'visual-btn-generate',
      'visual-btn-brandcolors',
      'visual-btn-addtext',
      'visual-gallery-section',
    ],
  },
];

test.describe('Interactive Guide - Data Guide Attributes', () => {
  for (const page of pagesWithGuides) {
    test(`${page.path} - all data-guide elements exist`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      const missingGuides: string[] = [];

      for (const guide of page.guides) {
        const element = browserPage.locator(`[data-guide="${guide}"]`);
        const count = await element.count();
        if (count === 0) {
          missingGuides.push(guide);
        }
      }

      if (missingGuides.length > 0) {
        console.log(`Missing guides on ${page.path}:`, missingGuides);
      }

      expect(missingGuides).toHaveLength(0);
    });
  }
});

test.describe('Interactive Guide - Functionality', () => {
  test('Guide button opens and navigates through steps', async ({ page }) => {
    await page.goto('/conversations');
    await page.waitForLoadState('networkidle');

    // Attendre l'hydratation React (le bouton est rendu côté client après isHydrated)
    // Le bouton contient "Guide interactif" et l'icône HelpCircle
    const guideButton = page.locator('button:has-text("Guide interactif")');
    await expect(guideButton).toBeVisible({ timeout: 15000 });

    // Cliquer sur le bouton
    await guideButton.click();

    // Le tooltip doit apparaître (attendre le scroll et l'animation)
    await page.waitForTimeout(1500);

    // Le tooltip est un div fixed avec le header violet (pas le bouton)
    // Le tooltip a une largeur fixe de 400px
    const tooltipPanel = page.locator('div.fixed.w-\\[400px\\]');
    await expect(tooltipPanel).toBeVisible({ timeout: 10000 });

    // Le premier élément doit être highlighté - vérifier le nom dans le tooltip
    await expect(page.locator('h3:has-text("KPI Total Conversations")')).toBeVisible();

    // Navigation vers l'élément suivant
    const nextButton = page.locator('button:has-text("Suivant")');
    await nextButton.click();
    await page.waitForTimeout(800);

    // Le deuxième élément doit être visible dans le tooltip
    await expect(page.locator('h3:has-text("KPI Temps de Réponse")')).toBeVisible();

    // Fermer le guide via le bouton X dans le header du tooltip
    // Le X est dans le header avec le gradient violet
    const closeButton = tooltipPanel.locator('button:has(svg.lucide-x)');
    await closeButton.click();

    // Le tooltip panel ne doit plus être visible
    await expect(tooltipPanel).not.toBeVisible({ timeout: 5000 });
  });

  test('Guide shows correct number of steps', async ({ page }) => {
    await page.goto('/social');
    await page.waitForLoadState('networkidle');

    // Attendre le bouton Guide interactif
    const guideButton = page.locator('button:has-text("Guide interactif")');
    await expect(guideButton).toBeVisible({ timeout: 15000 });
    await guideButton.click();

    await page.waitForTimeout(1500);

    // Vérifier le compteur d'étapes (1 / X) - 6 éléments pour /social (filtres regroupés)
    const stepCounter = page.locator('text=/1 \\/ \\d+/');
    await expect(stepCounter).toBeVisible({ timeout: 10000 });

    // Vérifier que le nombre total correspond au nombre de guides configurés (6)
    const counterText = await stepCounter.textContent();
    expect(counterText).toContain('/ 6');
  });
});
