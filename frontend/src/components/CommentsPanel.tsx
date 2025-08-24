import React, { useState } from 'react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
    color: string;
  };
  content: string;
  timestamp: Date;
  replies?: Comment[];
  cellReference?: string;
}

export const CommentsPanel: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'John Doe',
        avatar: '',
        initials: 'JD',
        color: 'bg-blue-500'
      },
      content: 'The completion rate for LinkedIn URLs seems low. Should we prioritize data enrichment for this field?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      cellReference: 'LinkedIn URL - Quality',
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Alice Smith', 
            avatar: '',
            initials: 'AS',
            color: 'bg-green-500'
          },
          content: 'Good point! I can run the LinkedIn enrichment script on the missing profiles.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: '2',
      author: {
        name: 'Mike Kim',
        avatar: '',
        initials: 'MK', 
        color: 'bg-purple-500'
      },
      content: 'The skills field has great coverage! This will be really useful for semantic matching.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      cellReference: 'Skills - Completeness'
    },
    {
      id: '3',
      author: {
        name: 'Sarah Chen',
        avatar: '',
        initials: 'SC',
        color: 'bg-pink-500'
      },
      content: 'Should we add data validation rules for the location field? Some entries seem inconsistent.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      cellReference: 'Location - Quality'
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: '',
        initials: 'YU',
        color: 'bg-gray-500'
      },
      content: newComment,
      timestamp: new Date()
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const addReply = (parentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: {
        name: 'You',
        avatar: '',
        initials: 'YU', 
        color: 'bg-gray-500'
      },
      content: replyContent,
      timestamp: new Date()
    };

    setComments(comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));
    
    setReplyingTo(null);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mb-4'} group`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full ${comment.author.color} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-xs font-medium">{comment.author.initials}</span>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                  {comment.cellReference && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {comment.cellReference}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            </div>

            {/* Comment Actions */}
            {!isReply && (
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <button 
                  onClick={() => setReplyingTo(comment.id)}
                  className="hover:text-blue-600 flex items-center space-x-1"
                >
                  <span>💬</span>
                  <span>Reply</span>
                </button>
                <button className="hover:text-red-600 flex items-center space-x-1">
                  <span>👍</span>
                  <span>Like</span>
                </button>
              </div>
            )}

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addReply(comment.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
          <span>💬</span>
          <span>Comments & Discussions</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Collaborate on data insights and analysis
        </p>
      </div>

      {/* New Comment Input */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">YU</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment about the data..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <button className="hover:text-blue-600">📎 Attach</button>
                <button className="hover:text-blue-600">🎯 Reference Cell</button>
              </div>
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💭</div>
            <div className="text-gray-500">
              <p className="font-medium">No comments yet</p>
              <p className="text-sm">Start a discussion about the data</p>
            </div>
          </div>
        ) : (
          <div>
            {comments.map(comment => renderComment(comment))}
          </div>
        )}
      </div>

      {/* Active Collaborators */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">Active Now</span>
          <div className="flex -space-x-2">
            {[
              { initials: 'JD', color: 'bg-blue-500' },
              { initials: 'AS', color: 'bg-green-500' },
              { initials: 'MK', color: 'bg-purple-500' }
            ].map((user, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full ${user.color} border-2 border-white flex items-center justify-center`}
              >
                <span className="text-white text-xs font-medium">{user.initials}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};