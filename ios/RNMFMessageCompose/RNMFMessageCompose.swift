//
//  RNMFMessageCompose.swift
//  whistlenative
//
//  Created by Brian Ogden on 12/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import MessageUI
import MobileCoreServices


@objc(RNMFMessageCompose)
class RNMFMessageCompose: NSObject, MFMessageComposeViewControllerDelegate {
  var resolve: RCTPromiseResolveBlock?
  var reject: RCTPromiseRejectBlock?

  @objc func canSendText(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    return resolve(MFMessageComposeViewController.canSendText())
  }
  func textToData(utf8: String?, base64: String?) -> Data? {
    if let utf8 = utf8 {
      return utf8.data(using: .utf8)
    }
    if let base64 = base64 {
      return Data(base64Encoded: base64, options: .ignoreUnknownCharacters)
    }
    return nil
  }
  func toFilename(filename: String?, ext: String?) -> String? {
    if let ext = ext {
      return (filename ?? UUID().uuidString) + ext
    }
    return nil
  }
  @objc func send(_ data: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if !MFMessageComposeViewController.canSendText() {
      reject("cannotSendMessage", "Cannot send message", nil)
      return
    }
    let vc = MFMessageComposeViewController()

    if let value = data["subject"] as? String {
      vc.subject = value
    }
    if let value = data["body"] as? String {
      vc.body = value
    }
    if let value = data["recipients"] as? [String] {
      vc.recipients = value

    }

      if let value = data["attachments"] as? [[String: String]] {
        for dict in value {
          if let data = textToData(utf8: dict["text"], base64: dict["data"]), let mimeType = dict["mimeType"], let filename = toFilename(filename: dict["filename"], ext: dict["ext"]), let fileurl = dict["fileurl"] {
              let imageURL: String = fileurl//"https://app.cassa.io/uploads/teams/mn-builders-image-4021572839632.png"
              if (imageURL.count > 2) {
                let url = URL(string: imageURL)
                if mimeType.contains("image/png") {
                  if let data = try? Data(contentsOf: url!) {
                    let image: UIImage = UIImage(data:data)!
                    let dataImage = imageURL.contains(".png") ? image.pngData() : image.jpegData(compressionQuality: 1)
                    vc.addAttachmentData(dataImage!, typeIdentifier: mimeType, filename: filename)
                  }
                } else {
                  if let fileData = try? NSData(contentsOf: url!) as! Data {
                    vc.addAttachmentData(fileData, typeIdentifier: mimeType, filename: filename)
                  }
                }
             }
          }
        }
    }


    vc.messageComposeDelegate = self

    if present(viewController: vc) {
      self.resolve = resolve
      self.reject = reject
    } else {
      reject("failed", "Could not present view controller", nil)
    }
  }

  func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
    switch (result) {
    case .cancelled:
      //reject?("cancelled", "Operation has been cancelled", nil)
       resolve?("cancel")
      break
    case .sent:
      resolve?("sent")
      break
    case .failed:
      reject?("failed", "Operation has failed", nil)
      break
    }
    resolve = nil
    reject = nil
    controller.dismiss(animated: true, completion: nil)

  }

  private func getTopViewController(window: UIWindow?) -> UIViewController? {
    if let window = window {
      var top = window.rootViewController
      while true {
        if let presented = top?.presentedViewController {
          top = presented
        } else if let nav = top as? UINavigationController {
          top = nav.visibleViewController
        } else if let tab = top as? UITabBarController {
          top = tab.selectedViewController
        } else {
          break
        }
      }
      return top
    }
    return nil
  }

  private func present(viewController: UIViewController) -> Bool {
    guard let topVc = getTopViewController(window: UIApplication.shared.keyWindow) else {
      return false
    }
    
    DispatchQueue.main.async {
      topVc.present(viewController, animated: true, completion: nil)
    }
    
    return true
  }
}
