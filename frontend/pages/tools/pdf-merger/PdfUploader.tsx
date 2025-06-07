import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface UploadedFile {
  id: string;
  file: File;
}

interface PdfUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    onFilesChange(files.map(f => f.file));
  }, [files, onFilesChange]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newFiles = Array.from(files);
    const [removed] = newFiles.splice(result.source.index, 1);
    newFiles.splice(result.destination.index, 0, removed);
    setFiles(newFiles);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div>
      <input type="file" multiple accept="application/pdf" onChange={onFileChange} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pdf-list">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ padding: 0, listStyle: 'none', maxHeight: 300, overflowY: 'auto' }}>
              {files.map((file, index) => (
                <Draggable key={file.id} draggableId={file.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 10,
                        marginBottom: 8,
                        background: snapshot.isDragging ? '#bbdefb' : '#f0f0f0',
                        borderRadius: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span>{file.file.name}</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#e53e3e',
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
                        aria-label={`Remove ${file.file.name}`}
                      >
                        &times;
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PdfUploader;
