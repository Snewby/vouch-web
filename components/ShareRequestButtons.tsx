/**
 * Share buttons for request links - WhatsApp, SMS, Copy
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, MessageCircle, Mail } from 'lucide-react';

interface ShareRequestButtonsProps {
  requestToken: string;
  requestTitle: string;
  businessType?: string;
  location?: string;
}

export function ShareRequestButtons({
  requestToken,
  requestTitle,
  businessType,
  location,
}: ShareRequestButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/request/${requestToken}`
    : '';

  // Create share message
  const getMessage = () => {
    if (businessType && location) {
      return `Can anyone recommend a ${businessType} in ${location}? Add your recommendation here: ${url}`;
    }
    return `${requestTitle}\n\nAdd your recommendation here: ${url}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsAppShare = () => {
    const message = getMessage();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleSMSShare = () => {
    const message = getMessage();
    // SMS URL scheme works on both iOS and Android
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-3">
      {/* Share Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="w-full"
        >
          <Copy className="mr-2 h-4 w-4" />
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>

        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          className="w-full"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>

        <Button
          onClick={handleSMSShare}
          variant="outline"
          className="w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          SMS
        </Button>
      </div>

      {/* Success Alert */}
      {copied && (
        <Alert>
          <AlertDescription>
            Link copied to clipboard! Share it to get recommendations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
