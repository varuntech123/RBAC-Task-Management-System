import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="glass-card stats-card flex items-center gap-4" style={{ padding: '1.5rem', flex: 1 }}>
      <div className="stats-icon flex items-center justify-center" style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '12px', 
        background: `${color}20`,
        color: color 
      }}>
        <Icon size={24} />
      </div>
      <div className="stats-info flex flex-col">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{title}</span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</span>
          {trend && (
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>{trend}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
