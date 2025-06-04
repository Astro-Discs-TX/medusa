'use client'

import { useState } from 'react'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'

interface DebugPanelProps {
  data: any
  title?: string
}

export const DebugPanel = ({ data, title = "Debug Info" }: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="tonal" 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        {isOpen ? 'Hide Debug' : 'Show Debug'}
      </Button>
      
      {isOpen && (
        <Box className="mt-2 max-h-[80vh] w-[90vw] max-w-[600px] overflow-auto rounded-md border border-gray-200 bg-white p-4 shadow-lg">
          <h3 className="mb-2 text-lg font-bold">{title}</h3>
          <pre className="whitespace-pre-wrap text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  )
}

export default DebugPanel 