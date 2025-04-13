"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PollResponseProps {
  pollId: string
  eventId: string
  guestId: string
  question: string
  options: string[]
}

export default function PollResponse({
  pollId,
  eventId,
  guestId,
  question,
  options
}: PollResponseProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [previousResponse, setPreviousResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function checkPreviousResponse() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('event_poll_responses')
          .select('selected_option')
          .eq('poll_id', pollId)
          .eq('guest_id', guestId)
          .maybeSingle()

        if (error) {
          console.error('Error fetching poll response:', error)
        } else if (data) {
          setPreviousResponse(data.selected_option)
          setSelectedOption(data.selected_option)
        }
      } catch (err) {
        console.error('Error checking previous response:', err)
      } finally {
        setLoading(false)
      }
    }

    checkPreviousResponse()
  }, [pollId, guestId, supabase])

  const handleSubmit = async () => {
    if (!selectedOption) return

    try {
      setSubmitting(true)

      // Check if there's a previous response to update or insert new
      const { error } = previousResponse
        ? await supabase
            .from('event_poll_responses')
            .update({
              selected_option: selectedOption,
              updated_at: new Date().toISOString()
            })
            .eq('poll_id', pollId)
            .eq('guest_id', guestId)
        : await supabase
            .from('event_poll_responses')
            .insert({
              poll_id: pollId,
              event_id: eventId,
              guest_id: guestId,
              selected_option: selectedOption,
              created_at: new Date().toISOString()
            })

      if (error) {
        console.error('Error submitting poll response:', error)
        toast({
          title: "Error",
          description: "Failed to save your response. Please try again.",
          variant: "destructive"
        })
      } else {
        setPreviousResponse(selectedOption)
        toast({
          title: "Response Saved",
          description: "Your poll response has been saved.",
          variant: "default"
        })
      }
    } catch (err) {
      console.error('Error handling poll response:', err)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mr-2" />
        <span className="text-sm text-muted-foreground">Loading poll response...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <RadioGroup 
          value={selectedOption || undefined}
          onValueChange={setSelectedOption}
          className="space-y-2"
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedOption || submitting || selectedOption === previousResponse}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : selectedOption === previousResponse ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Response Saved
            </>
          ) : (
            "Submit Response"
          )}
        </Button>
        
        {previousResponse && selectedOption !== previousResponse && (
          <span className="text-sm text-muted-foreground">
            Previously selected: {previousResponse}
          </span>
        )}
      </div>
    </div>
  )
} 