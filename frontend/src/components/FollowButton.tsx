import React, { useEffect, useState } from 'react';
import '../styles/App.css';

interface FollowButtonProps {
  targetUsername: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUsername }) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`/api/follow-status/${targetUsername}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setIsFollowing(data.is_following);
        setLoading(false);
      });
  }, [targetUsername]);

  const toggleFollow = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/toggle-follow/${targetUsername}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    const data = await res.json();
    setIsFollowing(data.is_following);
  };

  if (loading) return null;

  return (
    <button
      className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
      onClick={toggleFollow}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
