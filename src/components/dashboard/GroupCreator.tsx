import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Friend {
  name: string;
  isLinked: boolean;
}

const GroupCreator = () => {
  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriendName, setNewFriendName] = useState("");
  const { toast } = useToast();

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      setFriends([...friends, { name: newFriendName.trim(), isLinked: false }]);
      setNewFriendName("");
    }
  };

  const handleRemoveFriend = (index: number) => {
    const newFriends = [...friends];
    newFriends.splice(index, 1);
    setFriends(newFriends);
  };

  const handleCreateGroup = () => {
    if (groupName && friends.length > 0) {
      // Here you would typically save to a backend
      toast({
        title: "Group Created! 🎉",
        description: `${groupName} has been created with ${friends.length} friends`,
      });
      setGroupName("");
      setFriends([]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add a group name and at least one friend",
      });
    }
  };

  return (
    <div className="space-y-6 bg-dashboard-card p-6 rounded-lg">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Create a New Group</h3>
        <Input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="bg-dashboard-background text-white"
        />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Friend's Name"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
            className="bg-dashboard-background text-white"
          />
          <Button onClick={handleAddFriend} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {friends.map((friend, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-dashboard-background p-2 rounded"
            >
              <span className="text-white">{friend.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFriend(index)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleCreateGroup}
        className="w-full bg-dashboard-accent hover:bg-dashboard-accent/90"
      >
        Create Group
      </Button>
    </div>
  );
};

export default GroupCreator;