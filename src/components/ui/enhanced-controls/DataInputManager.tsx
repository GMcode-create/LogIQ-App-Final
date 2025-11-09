import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Shuffle, TrendingUp, TrendingDown, BarChart, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface DataPattern {
  name: string;
  generator: (size: number) => number[];
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface DataInputManagerProps {
  onDataChange: (data: number[]) => void;
  currentData: number[];
  maxArraySize?: number;
  className?: string;
}

export const DataInputManager: React.FC<DataInputManagerProps> = ({
  onDataChange,
  currentData,
  maxArraySize = 50,
  className = '',
}) => {
  const [arraySize, setArraySize] = useState(currentData.length.toString());
  const [customInput, setCustomInput] = useState(currentData.join(', '));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const dataPatterns: DataPattern[] = [
    {
      name: 'Random',
      generator: (size) => Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5),
      description: 'Completely random values',
      icon: <Shuffle className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      name: 'Sorted',
      generator: (size) => Array.from({ length: size }, (_, i) => (i + 1) * 5),
      description: 'Already sorted in ascending order',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-green-500',
    },
    {
      name: 'Reverse Sorted',
      generator: (size) => Array.from({ length: size }, (_, i) => (size - i) * 5),
      description: 'Sorted in descending order (worst case)',
      icon: <TrendingDown className="w-4 h-4" />,
      color: 'bg-red-500',
    },
    {
      name: 'Nearly Sorted',
      generator: (size) => {
        const arr = Array.from({ length: size }, (_, i) => (i + 1) * 5);
        // Swap a few random elements
        for (let i = 0; i < Math.max(1, Math.floor(size * 0.1)); i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        }
        return arr;
      },
      description: 'Mostly sorted with few out-of-place elements',
      icon: <BarChart className="w-4 h-4" />,
      color: 'bg-yellow-500',
    },
    {
      name: 'Duplicates',
      generator: (size) => {
        const uniqueValues = Math.max(3, Math.floor(size / 3));
        return Array.from({ length: size }, () => Math.floor(Math.random() * uniqueValues) * 10 + 10);
      },
      description: 'Contains many duplicate values',
      icon: <BarChart className="w-4 h-4" />,
      color: 'bg-purple-500',
    },
    {
      name: 'Mountain',
      generator: (size) => {
        const mid = Math.floor(size / 2);
        return Array.from({ length: size }, (_, i) => {
          const distance = Math.abs(i - mid);
          return Math.max(5, (mid - distance + 1) * 8);
        });
      },
      description: 'Peak in the middle, slopes down',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-indigo-500',
    },
  ];

  const generatePattern = (pattern: DataPattern) => {
    const size = parseInt(arraySize) || 10;
    if (size > maxArraySize) {
      toast({
        title: 'Array too large',
        description: `Maximum array size is ${maxArraySize}`,
        variant: 'destructive',
      });
      return;
    }
    
    const newData = pattern.generator(size);
    onDataChange(newData);
    setCustomInput(newData.join(', '));
    
    toast({
      title: 'Data generated',
      description: `Generated ${pattern.name.toLowerCase()} array with ${size} elements`,
    });
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    const values = value
      .split(',')
      .map(v => parseInt(v.trim()))
      .filter(v => !isNaN(v));
    
    if (values.length > 0) {
      onDataChange(values);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: number[] = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          data = Array.isArray(parsed) ? parsed.filter(v => typeof v === 'number') : [];
        } else if (file.name.endsWith('.csv')) {
          data = content
            .split(/[,\n\r]/)
            .map(v => parseFloat(v.trim()))
            .filter(v => !isNaN(v));
        } else {
          // Try to parse as comma-separated values
          data = content
            .split(/[,\s\n\r]+/)
            .map(v => parseFloat(v.trim()))
            .filter(v => !isNaN(v));
        }

        if (data.length === 0) {
          throw new Error('No valid numbers found in file');
        }

        if (data.length > maxArraySize) {
          data = data.slice(0, maxArraySize);
          toast({
            title: 'Array truncated',
            description: `File contained ${data.length} values, truncated to ${maxArraySize}`,
            variant: 'destructive',
          });
        }

        onDataChange(data);
        setCustomInput(data.join(', '));
        setArraySize(data.length.toString());

        toast({
          title: 'File uploaded',
          description: `Loaded ${data.length} values from ${file.name}`,
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Could not parse the file. Please check the format.',
          variant: 'destructive',
        });
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const exportData = () => {
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'algorithm-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported',
      description: 'Array data has been downloaded as JSON file',
    });
  };

  return (
    <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-400">Enhanced Data Input</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patterns" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="size">Array Size</Label>
              <div className="flex space-x-2">
                <Input
                  id="size"
                  value={arraySize}
                  onChange={(e) => setArraySize(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white w-20"
                  placeholder="10"
                  type="number"
                  min="1"
                  max={maxArraySize}
                />
                <Badge variant="outline" className="text-xs">
                  Max: {maxArraySize}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {dataPatterns.map((pattern) => (
                <Button
                  key={pattern.name}
                  variant="outline"
                  onClick={() => generatePattern(pattern)}
                  className="justify-start h-auto p-3 border-slate-600 hover:bg-slate-700"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded ${pattern.color} text-white`}>
                      {pattern.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-white">{pattern.name}</div>
                      <div className="text-xs text-gray-400">{pattern.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-input">Custom Array (comma-separated)</Label>
              <textarea
                id="custom-input"
                value={customInput}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                className="w-full h-24 bg-slate-700 border-slate-600 rounded px-3 py-2 text-white text-sm resize-none"
                placeholder="64, 34, 25, 12, 22, 11, 90"
              />
            </div>
            
            <div className="text-xs text-gray-400">
              Current array: [{currentData.length} elements] {currentData.slice(0, 10).join(', ')}
              {currentData.length > 10 && '...'}
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-gray-300">
                Upload data from JSON or CSV files
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="flex-1 border-slate-600 hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3 h-3" />
                  <span>Supported formats: JSON arrays, CSV files, or plain text with numbers</span>
                </div>
                <div>Example JSON: [64, 34, 25, 12, 22, 11, 90]</div>
                <div>Example CSV: 64,34,25,12,22,11,90</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};