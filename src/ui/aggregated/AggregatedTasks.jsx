// =============================================================================
// FILE: AggregatedTasks.jsx
// PATH: src/ui/aggregated/AggregatedTasks.jsx
// VERSION: 0.0.3
// PURPOSE: Widok zbiorczy zadań – orkiestrator renderujący filtry, nagłówek i listę grup. Logika w useAggregatedTasks.
// FUNCTIONS: AggregatedTasks
// DEPENDS ON: react, translations.js, icons.js, AggregatedProjectSection.jsx, useAggregatedTasks.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useContext } from 'react';
import { TranslationContext } from '../../utils/translations.js';
import { ICONS } from '../../utils/icons.js';
import AggregatedProjectSection from './AggregatedProjectSection.jsx';
import { useAggregatedTasks, STATUSES, PRIORITIES, SECTIONS } from '../../hooks/useAggregatedTasks.js';

// ─── AggregatedTasks() – dashboard zbiorczy zadań ze wszystkich grup
export default function AggregatedTasks() {
  const { t } = useContext(TranslationContext);
  const {
    loading, grouped, hasFilter,
    totalActive, totalAll, totalGroups,
    collapsed, hidden,
    filterText, filterStatus, filterPriority, filterSection,
    setFilterText, setFilterStatus, setFilterPriority, setFilterSection,
    loadData, toggleCollapse, toggleHidden, collapseAll, expandAll, clearFilters,
  } = useAggregatedTasks();

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      <span style={{ fontSize: 24 }}>{ICONS.LOADING}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>

      {/* ─── Nagłówek ─── */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{ICONS.AGGREGATEDTASKS}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
              {t('aggregatedTasks.title')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {totalActive} {t('aggregatedTasks.stat_active')} · {totalAll} {t('aggregatedTasks.stat_total')} · {totalGroups} {t('aggregatedTasks.stat_groups')}
            </div>
          </div>
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={loadData} title={t('common.refresh')}>
            {ICONS.REFRESH}
          </button>
        </div>

        {/* ─── Filtry ─── */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="form-input" style={{ height: 28, fontSize: 12, flex: '1 1 120px', minWidth: 80 }}
            placeholder={t('aggregatedTasks.filter_label')} value={filterText}
            onChange={e => setFilterText(e.target.value)} />
          <select className="form-select" style={{ height: 28, fontSize: 12 }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">{t('aggregatedTasks.filter_all_statuses')}</option>
            {STATUSES.map(s => <option key={s} value={s}>{t(`tasks.status_${s}`)}</option>)}
          </select>
          <select className="form-select" style={{ height: 28, fontSize: 12 }}
            value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">{t('aggregatedTasks.filter_all_priorities')}</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="form-select" style={{ height: 28, fontSize: 12 }}
            value={filterSection} onChange={e => setFilterSection(e.target.value)}>
            <option value="">{t('aggregatedTasks.filter_all_sections')}</option>
            {SECTIONS.map(s => <option key={s} value={s}>{t(`tasks.section_${s}`)}</option>)}
          </select>
        </div>

        {/* ─── Akcje zwijania ─── */}
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={collapseAll}>{t('aggregatedTasks.collapse_all')}</button>
          <button className="btn btn-secondary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={expandAll}>{t('aggregatedTasks.expand_all')}</button>
          {hasFilter && <button className="btn btn-secondary" style={{ fontSize: 11, padding: '3px 8px' }} onClick={clearFilters}>{t('aggregatedTasks.clear_filters')}</button>}
        </div>
      </div>

      {/* ─── Lista grup ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
            {hasFilter ? t('aggregatedTasks.no_results') : t('aggregatedTasks.no_tasks')}
          </div>
        )}
        {grouped.map(({ groupId, groupName, tasks }) => (
          <AggregatedProjectSection
            key={groupId} groupId={groupId} groupName={groupName} tasks={tasks}
            hidden={hidden[groupId]} collapsed={collapsed[groupId]}
            onToggleHidden={() => toggleHidden(groupId)}
            onToggleCollapse={() => toggleCollapse(groupId)}
          />
        ))}
      </div>
    </div>
  );
}