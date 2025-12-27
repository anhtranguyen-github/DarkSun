import React from 'react';
import Card from '../common/Card';
import './RecentActivityFeed.css';

const RecentActivityFeed = ({ activities }) => {
  return (
    <Card>
      <h2 className="feed-title">Cập nhật gần đây</h2>
      <div className="activity-list">
        {activities && activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <p>{activity.text}</p>
              <span>{activity.time}</span>
            </div>
          ))
        ) : (
          <p>Không có hoạt động nào gần đây.</p>
        )}
      </div>
    </Card>
  );
};

export default RecentActivityFeed;