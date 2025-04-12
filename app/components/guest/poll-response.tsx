"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PollResponseProps {
  pollId: string
  guestId: string
  question: string
  options: string[]
  className?: string
}

export default function PollResponse({ pollId, guestId, question, options, className }: PollResponseProps) {
  const supabase = createClientComponentClient()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [previousResponse, setPreviousResponse] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch any existing response when the component loads
  useEffect(() => {
    async function fetchExistingResponse() {
      try {
        const { data, error } = await supabase
          .from('event_poll_responses')
          .select('response')
          .eq('poll_id', pollId)
          .eq('guest_id', guestId)
          .maybeSingle()
        
        if (error) {
          console.error('Error fetching poll response:', error)
          return
        }
        
        if (data?.response) {
          setSelectedOption(data.response)
          setPreviousResponse(data.response)
        }
      } catch (err) {
        console.error('Failed to fetch poll response:', err)
      }
    }
    
    fetchExistingResponse()
  }, [pollId, guestId, supabase])
  
  // Submit the poll response
  const handleSubmit = async () => {
    if (!selectedOption) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Check if we're updating or creating a response
      if (previousResponse) {
        // Update the existing response
        const { error } = await supabase
          .from('event_poll_responses')
          .update({ 
            response: selectedOption,
            updated_at: new Date().toISOString()
          })
          .eq('poll_id', pollId)
          .eq('guest_id', guestId)
        
        if (error) throw error
      } else {
        // Create a new response
        const { error } = await supabase
          .from('event_poll_responses')
          .insert({
            poll_id: pollId,
            guest_id: guestId,
            response: selectedOption,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (error) throw error
      }
      
      setPreviousResponse(selectedOption)
      setIsSuccess(true)
      
      // Reset success message after a delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (err: any) {
      console.error('Error submitting poll response:', err)
      setError(err.message || 'Failed to submit your response')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className={cn("border rounded-lg p-4", className)}>
      <h3 className="font-semibold mb-3">{question}</h3>
      
      <RadioGroup 
        value={selectedOption || ''} 
        onValueChange={setSelectedOption}
        className="space-y-2 mb-4"
      >
        {options.map((option, index) => (
          <div 
            key={index}
            className="border rounded p-3 flex items-center hover:bg-gray-50 cursor-pointer"
          >
            <RadioGroupItem id={`option-${index}`} value={option} className="mr-2" />
            <Label 
              htmlFor={`option-${index}`}
              className="cursor-pointer flex-1"
            >
              {option}
            </Label>
            {previousResponse === option && (
              <CheckCircle className="h-4 w-4 text-emerald-500 ml-2" />
            )}
          </div>
        ))}
      </RadioGroup>
      
      {error && (
        <p className="text-sm text-red-500 mb-3">{error}</p>
      )}
      
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedOption || (selectedOption === previousResponse && !isSuccess)}
          className={cn(
            "relative",
            isSuccess && "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Response Recorded
            </>
          ) : previousResponse ? (
            "Update Response"
          ) : (
            "Submit Response"
          )}
        </Button>
      </div>
    </div>
  )
} 