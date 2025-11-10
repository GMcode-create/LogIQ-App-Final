import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Code, Clock, Trophy, Settings } from "lucide-react";

export const UserProfile = () => {
  const [savedAlgorithms] = useState([
    { name: "Custom Bubble Sort", language: "JavaScript", created: "2 hours ago", runs: 15 },
    { name: "Binary Search Tree", language: "JavaScript", created: "1 day ago", runs: 8 },
    { name: "Quick Sort Variant", language: "JavaScript", created: "3 days ago", runs: 23 },
  ]);

  const [stats] = useState({
    algorithmsCreated: 12,
    totalRuns: 156,
    favoriteAlgorithm: "Quick Sort",
    joinDate: "January 2024"
  });

  // Mock user data for demo purposes
  const user = {
    name: "Demo User",
    email: "demo@logiq.com"
  };

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {stats.joinDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.algorithmsCreated}</div>
            <div className="text-sm text-gray-400">Algorithms Created</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalRuns}</div>
            <div className="text-sm text-gray-400">Total Runs</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{stats.favoriteAlgorithm}</div>
            <div className="text-sm text-gray-400">Most Used</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-700">
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Saved Algorithms */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-purple-400">Saved Algorithms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedAlgorithms.map((algorithm, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="font-medium text-white">{algorithm.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Badge variant="outline" className="text-xs">
                        {algorithm.language}
                      </Badge>
                      <span>•</span>
                      <span>{algorithm.created}</span>
                      <span>•</span>
                      <span>{algorithm.runs} runs</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                    Run
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};