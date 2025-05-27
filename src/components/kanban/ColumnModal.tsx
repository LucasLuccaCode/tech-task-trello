
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useKanban } from '@/contexts/KanbanContext';
import { STATUS_COLORS } from '@/types/kanban';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColumnModal: React.FC<ColumnModalProps> = ({ isOpen, onClose }) => {
  const { createColumn, currentProject } = useKanban();
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(STATUS_COLORS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentProject) return;

    const maxOrder = Math.max(...currentProject.columns.map(col => col.order), -1);
    
    createColumn({
      title: title.trim(),
      color: selectedColor,
      order: maxOrder + 1
    });

    setTitle('');
    setSelectedColor(STATUS_COLORS[0].value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-gray-900/95 border-gray-800 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Novo Status</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Status
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Em Revisão"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Cor do Status
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STATUS_COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 transition-all touch-manipulation ${
                    selectedColor === color.value
                      ? 'border-white scale-110'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Criar Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
