import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, LogOut, Tag } from 'lucide-react';

interface HeaderProps {
  onSave?: () => void;
  fields: string[];
  onFieldsChange: (fields: string[]) => void;
}

export const Header = ({ onSave, fields, onFieldsChange }: HeaderProps) => {
  const { logout, user } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com";

  // Separate states for director and non-director
  const [directorSelectedFields, setDirectorSelectedFields] = useState<string[]>(() => {
    const savedFields = localStorage.getItem('directorSelectedFields');
    return savedFields ? JSON.parse(savedFields) : [];
  });

  const [nonDirectorSelectedField, setNonDirectorSelectedField] = useState<string>(() => {
    const savedField = localStorage.getItem('nonDirectorSelectedField');
    return savedField || '';
  });

  const handleFieldChange = (field: string) => {
    if (isDirector) {
      const updatedFields = directorSelectedFields.includes(field)
        ? directorSelectedFields.filter(f => f !== field)
        : [...directorSelectedFields, field];
      setDirectorSelectedFields(updatedFields);
      onFieldsChange(updatedFields);
    } else {
      setNonDirectorSelectedField(field);
      onFieldsChange([field]);
    }
  };

  useEffect(() => {
    if (isDirector) {
      localStorage.setItem('directorSelectedFields', JSON.stringify(directorSelectedFields));
    } else {
      localStorage.setItem('nonDirectorSelectedField', nonDirectorSelectedField);
    }
  }, [directorSelectedFields, nonDirectorSelectedField, isDirector]);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-sm md:text-xl font-semibold text-gray-800">H Calendar</h1>
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">v1.0.0</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-4">
          <select
            value={isDirector ? '' : nonDirectorSelectedField}
            onChange={(e) => handleFieldChange(e.target.value)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
          >
            <option value="" disabled>
              {isDirector ? "Filières" : "Filière"}
            </option>
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            {(isDirector ? directorSelectedFields : [nonDirectorSelectedField]).map((field) => (
              <span
                key={field}
                className="px-2 py-1 max-h inline-flex items-center gap-1 text-sm bg-blue-500 text-white rounded-lg shadow-sm cursor-pointer"
                onClick={() => isDirector && handleFieldChange(field)}
              >
                <Tag className="w-4 h-4 mr-1 hidden text-xs md:inline" />
                <span className="text-xs md:text-sm flex items-center justify-center">{field}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isDirector && onSave && (
            <button
              onClick={onSave}
              className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center"
            >
              <Save className="w-4 h-4" />
              <span className="hidden md:inline ml-1">Save</span>
            </button>
          )}
          <button
            onClick={logout}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};